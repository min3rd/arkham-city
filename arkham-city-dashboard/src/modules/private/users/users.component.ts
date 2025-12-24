import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ArkButton,
  ArkDatatable,
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
  ArkSelect,
  ArkTextInput,
  BaseListComponent,
  CapitalizePipe,
} from 'arkhamcity';
import { debounceTime, takeUntil } from 'rxjs';
import { RoleResDto } from '@core/auth/auth.type';
import { RolesService } from '../roles/roles.service';
import {
  UpsertUserPayload,
  UserListItem,
  UserStatus,
  UsersService,
} from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    ArkButton,
    ArkDrawerContainer,
    ArkDrawer,
    ArkDrawerContent,
    ArkDatatable,
    ArkTextInput,
    ArkSelect,
    CapitalizePipe,
  ],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends BaseListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly rolesService = inject(RolesService);

  drawerOpened = false;
  loading = false;

  users: UserListItem[] = [];
  roles: RoleResDto[] = [];
  page = 1;
  limit = 10;
  total = 0;

  filtersForm = this.fb.group({
    search: [''],
    roleId: [''],
    status: [''],
  });

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    password: [''],
    roles: new FormControl<string[]>([], { nonNullable: true }),
    status: ['active' as UserStatus],
  });

  selectedUser: UserListItem | null = null;

  override ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
    this.filtersForm.valueChanges
      .pipe(debounceTime(200), takeUntil(this.unsubscribeAll))
      .subscribe(() => this.onFilterChange());
  }

  onFilterChange() {
    this.page = 1;
    this.loadUsers();
  }

  loadUsers(page = this.page) {
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    const { search, roleId, status } = this.filtersForm.value;
    this.usersService
      .list({
        search: search ?? undefined,
        roles: roleId ? [roleId] : undefined,
        status: (status as UserStatus | undefined) ?? undefined,
        page,
        limit: this.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (res) => {
          this.users = res.items ?? [];
          this.total = res.total ?? 0;
          this.page = res.page ?? page;
          this.limit = res.limit ?? this.limit;
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.users = [];
          this.total = 0;
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  loadRoles() {
    this.rolesService
      .list()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((roles) => {
        this.roles = roles ?? [];
        this.changeDetectorRef.markForCheck();
      });
  }

  openCreate() {
    this.selectedUser = null;
    this.drawerOpened = true;
    this.userForm.reset({
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      roles: [],
      status: 'active',
    });
    this.changeDetectorRef.markForCheck();
  }

  editUser(user: UserListItem) {
    this.selectedUser = user;
    this.drawerOpened = true;
    this.userForm.reset({
      email: user.email,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phoneNumber: user.phoneNumber ?? '',
      password: '',
      roles: (user.roles ?? []).map((role) => role._id as string),
      status: (user.status as UserStatus) ?? 'active',
    });
    this.changeDetectorRef.markForCheck();
  }

  closeDrawer() {
    this.drawerOpened = false;
    this.selectedUser = null;
    this.changeDetectorRef.markForCheck();
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.getRawValue();
    const payload: UpsertUserPayload = {
      email: formValue.email ?? '',
      firstName: formValue.firstName ?? undefined,
      lastName: formValue.lastName ?? undefined,
      phoneNumber: formValue.phoneNumber ?? undefined,
      password: formValue.password || undefined,
      roles: formValue.roles ?? [],
      status: (formValue.status as UserStatus) ?? 'active',
    };
    const request = this.selectedUser
      ? this.usersService.update(this.selectedUser._id, payload)
      : this.usersService.create(payload);
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    request.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: () => {
        this.drawerOpened = false;
        this.loading = false;
        this.loadUsers();
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  toggleStatus(user: UserListItem) {
    const nextStatus: UserStatus =
      user.status === 'disabled' ? 'active' : 'disabled';
    this.usersService
      .setStatus(user._id, nextStatus)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => this.loadUsers());
  }

  deleteUser(user: UserListItem) {
    if (!confirm('Delete this user?')) {
      return;
    }
    this.usersService
      .delete(user._id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => this.loadUsers());
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadUsers(page);
  }

  onPageSizeChange(size: number) {
    this.limit = size;
    this.onPageChange(1);
  }

  userDisplay(user: UserListItem): string {
    if (user.firstName || user.lastName) {
      return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    }
    return user.username || user.email;
  }

  statusColor(status?: UserStatus): string {
    return status === 'disabled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  }
}
