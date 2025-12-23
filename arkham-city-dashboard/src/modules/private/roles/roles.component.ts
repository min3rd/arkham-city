import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoleResDto } from '@core/auth/auth.type';
import { RolesService, UpsertRolePayload } from './roles.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent implements OnInit {
  roles: RoleResDto[] = [];
  loading = false;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>(''),
    permissions: new FormControl<string>(''),
    default: new FormControl<boolean>(false),
  });
  private readonly rolesService: RolesService = inject(RolesService);
  private readonly changeDetectorRef: ChangeDetectorRef = inject(
    ChangeDetectorRef,
  );

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    this.rolesService.list().subscribe({
      next: (roles) => {
        this.roles = roles ?? [];
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  edit(role: RoleResDto) {
    this.form.patchValue({
      id: role._id ?? null,
      name: role.name,
      description: role.description ?? '',
      permissions: (role.permissions ?? []).join(', '),
      default: role.default ?? false,
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const payload = this.mapFormToPayload();
    const id = this.form.value.id ?? undefined;
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    const request = id
      ? this.rolesService.update(id, payload)
      : this.rolesService.create(payload);
    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadRoles();
      },
      error: () => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  delete(role: RoleResDto) {
    if (!role._id) {
      return;
    }
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    this.rolesService.delete(role._id).subscribe({
      next: () => {
        if (this.form.value.id === role._id) {
          this.resetForm();
        }
        this.loadRoles();
      },
      error: () => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  resetForm() {
    this.form.reset({
      id: null,
      name: '',
      description: '',
      permissions: '',
      default: false,
    });
  }

  private mapFormToPayload(): UpsertRolePayload {
    const permissions = this.parsePermissions(this.form.value.permissions);
    return {
      name: this.form.value.name ?? '',
      description: this.form.value.description || undefined,
      permissions,
      default: this.form.value.default ?? false,
    };
  }

  private parsePermissions(raw: string | null | undefined): string[] {
    if (!raw) {
      return [];
    }
    return raw
      .split(',')
      .map((permission) => permission.trim())
      .filter(
        (permission) =>
          permission.length > 0 && this.isValidPermission(permission),
      );
  }

  private isValidPermission(permission: string): boolean {
    return permission.includes(':');
  }
}
