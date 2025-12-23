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
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  ArkButton,
  ArkCheckbox,
  ArkDatatable,
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
  ArkSelect,
  ArkTabContent,
  ArkTabGroup,
  ArkTabTitle,
  ArkTextInput,
  BaseListComponent,
  CapitalizePipe,
  Pagination,
} from 'arkhamcity';
import { RoleResDto } from '@core/auth/auth.type';
import {
  CreateRoleAssignmentPayload,
  RoleAssignmentRes,
  RoleAssignmentScope,
  RoleUser,
  RolesService,
  UpsertRolePayload,
} from './roles.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    ArkDrawerContainer,
    ArkDrawer,
    ArkDrawerContent,
    ArkDatatable,
    ArkButton,
    ArkTextInput,
    ArkCheckbox,
    ArkTabGroup,
    ArkTabContent,
    ArkSelect,
    CapitalizePipe,
  ],
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent extends BaseListComponent implements OnInit {
  readonly tabs: ArkTabTitle[] = [
    { id: 'overview', title: 'Overview' },
    { id: 'permissions', title: 'Permissions' },
    { id: 'users', title: 'Users' },
    { id: 'audit', title: 'Audit' },
  ];
  private permissionPool = new Set<string>();
  private readonly rolesService = inject(RolesService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translocoService = inject(TranslocoService);
  private readonly MIN_USER_QUERY_LENGTH = 2;

  drawerOpened = false;
  activeTab = 0;

  roles: RoleResDto[] = [];
  filteredRoles: RoleResDto[] = [];
  pageRoles: Pagination<RoleResDto> = {
    query: {},
    sort: [],
    page: 1,
    size: 10,
    total: 0,
    data: [],
  };
  loadingRoles = false;

  filtersForm = this.formBuilder.group({
    search: [''],
    defaultOnly: [false],
    permission: [''],
  });

  roleForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
    description: [''],
    default: [false],
  });

  selectedRole: RoleResDto | null = null;
  selectedPermissions: Set<string> = new Set<string>();
  permissionSearch = new FormControl<string>('');
  customPermission = new FormControl<string>('');

  assignments: RoleAssignmentRes[] = [];
  assignmentsLoading = false;
  assignmentForm = this.formBuilder.group({
    userId: ['', [Validators.required]],
    scope: ['global' as RoleAssignmentScope, [Validators.required]],
    projectId: [''],
    resourceId: [''],
  });
  userSearch = new FormControl<string>('');
  userResults: RoleUser[] = [];
  selectedUser?: RoleUser;

  override ngOnInit(): void {
    this.loadRoles();
    this.filtersForm.valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => this.applyFilters());
    this.permissionSearch.valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => this.changeDetectorRef.markForCheck());
    this.userSearch.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.unsubscribeAll),
      )
      .subscribe((query) => this.onSearchUsers(query ?? ''));
  }

  get filteredPermissions(): string[] {
    const search = (this.permissionSearch.value ?? '').toLowerCase();
    return this.availablePermissions()
      .filter((perm) =>
        search ? perm.toLowerCase().includes(search) : true,
      )
      .sort();
  }

  get canAssign(): boolean {
    return !!this.selectedRole?._id;
  }

  availablePermissions(): string[] {
    const existing = new Set<string>([
      ...this.permissionPool,
      ...this.selectedPermissions,
    ]);
    return Array.from(existing);
  }

  openCreate(): void {
    this.selectedRole = null;
    this.activeTab = 0;
    this.drawerOpened = true;
    this.roleForm.reset({
      id: '',
      name: '',
      description: '',
      default: false,
    });
    this.selectedPermissions = new Set<string>();
    this.assignments = [];
    this.selectedUser = undefined;
    this.assignmentForm.reset({
      userId: '',
      scope: 'global',
      projectId: '',
      resourceId: '',
    });
    this.changeDetectorRef.markForCheck();
  }

  selectRole(role: RoleResDto): void {
    this.selectedRole = role;
    this.drawerOpened = true;
    this.activeTab = 0;
    this.roleForm.reset({
      id: role._id ?? '',
      name: role.name,
      description: role.description ?? '',
      default: role.default ?? false,
    });
    this.selectedPermissions = new Set<string>(role.permissions ?? []);
    (role.permissions ?? []).forEach((perm) => this.permissionPool.add(perm));
    if (role._id) {
      this.loadAssignments(role._id);
    } else {
      this.assignments = [];
    }
    this.changeDetectorRef.markForCheck();
  }

  closeDrawer(): void {
    this.drawerOpened = false;
    this.selectedRole = null;
    this.changeDetectorRef.markForCheck();
  }

  onSearch(search: string): void {
    this.filtersForm.patchValue({ search }, { emitEvent: true });
  }

  onPageChange(page: number): void {
    this.updatePage(page);
  }

  onPageSizeChange(size: number): void {
    this.pageRoles.size = size;
    this.updatePage(1);
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }
    const payload: UpsertRolePayload = {
      name: (this.roleForm.value.name ?? '').trim(),
      description: this.roleForm.value.description || undefined,
      permissions: Array.from(this.selectedPermissions),
      default: this.roleForm.value.default ?? false,
    };
    const roleId = this.roleForm.value.id;
    this.loadingRoles = true;
    this.changeDetectorRef.markForCheck();
    const request = roleId
      ? this.rolesService.update(roleId, payload)
      : this.rolesService.create(payload);
    request.subscribe({
      next: (role) => {
        this.loadRoles(role?._id);
      },
      error: () => {
        this.loadingRoles = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  deleteRole(): void {
    if (!this.selectedRole?._id) {
      return;
    }
    this.loadingRoles = true;
    this.changeDetectorRef.markForCheck();
    this.rolesService.delete(this.selectedRole._id).subscribe({
      next: () => {
        this.closeDrawer();
        this.loadRoles();
      },
      error: () => {
        this.loadingRoles = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  togglePermission(permission: string): void {
    if (this.selectedPermissions.has(permission)) {
      this.selectedPermissions.delete(permission);
    } else {
      this.selectedPermissions.add(permission);
    }
    this.changeDetectorRef.markForCheck();
  }

  addCustomPermission(): void {
    const value = (this.customPermission.value ?? '').trim();
    if (!value || !this.isValidPermission(value)) {
      return;
    }
    this.selectedPermissions.add(value);
    this.permissionPool.add(value);
    this.customPermission.reset();
    this.changeDetectorRef.markForCheck();
  }

  isPermissionSelected(permission: string): boolean {
    return this.selectedPermissions.has(permission);
  }

  removePermission(permission: string): void {
    this.selectedPermissions.delete(permission);
    this.changeDetectorRef.markForCheck();
  }

  private isValidPermission(permission: string): boolean {
    const pattern = /^[a-z0-9]+([.:][a-z0-9-]+)+$/i;
    return pattern.test(permission.trim());
  }

  private loadRoles(focusId?: string): void {
    this.loadingRoles = true;
    this.rolesService.list().subscribe({
      next: (roles) => {
        this.roles = roles ?? [];
        this.permissionPool = new Set(
          this.roles.flatMap((role) => role.permissions ?? []),
        );
        this.applyFilters();
        if (focusId) {
          const found = this.roles.find((r) => r._id === focusId);
          if (found) {
            this.selectRole(found);
          }
        }
        this.loadingRoles = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.loadingRoles = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  private applyFilters(): void {
    const { search, defaultOnly, permission } = this.filtersForm.value;
    const normalizedSearch = (search ?? '').toLowerCase();
    const permissionFilter = (permission ?? '').toLowerCase();
    this.filteredRoles = this.roles.filter((role) => {
      const matchesSearch =
        !normalizedSearch ||
        role.name.toLowerCase().includes(normalizedSearch) ||
        (role.description ?? '').toLowerCase().includes(normalizedSearch);
      const matchesDefault = !defaultOnly || role.default;
      const matchesPermission =
        !permissionFilter ||
        (role.permissions ?? []).some((p) =>
          p.toLowerCase().includes(permissionFilter),
        );
      return matchesSearch && matchesDefault && matchesPermission;
    });
    this.updatePage(1);
  }

  private updatePage(page: number): void {
    const start = (page - 1) * this.pageRoles.size;
    const end = start + this.pageRoles.size;
    this.pageRoles = {
      query: {},
      sort: [],
      page,
      size: this.pageRoles.size,
      total: this.filteredRoles.length,
      data: this.filteredRoles.slice(start, end),
    };
    this.changeDetectorRef.markForCheck();
  }

  private loadAssignments(roleId: string): void {
    this.assignmentsLoading = true;
    this.rolesService
      .listAssignments({ roleId })
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (assignments) => {
          this.assignments = assignments ?? [];
          this.assignmentsLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.assignmentsLoading = false;
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  onSearchUsers(query?: string): void {
    if (!this.canAssign) {
      return;
    }
    const trimmed = (query ?? '').trim();
    if (trimmed.length < this.MIN_USER_QUERY_LENGTH) {
      this.userResults = [];
      this.selectedUser = undefined;
      this.assignmentForm.patchValue({ userId: '' });
      this.changeDetectorRef.markForCheck();
      return;
    }
    this.rolesService.searchUsers(trimmed).subscribe((users) => {
      this.userResults = users ?? [];
      this.changeDetectorRef.markForCheck();
    });
  }

  onDrawerOpenedChange(opened: boolean): void {
    this.drawerOpened = opened;
  }

  pickUser(user: RoleUser): void {
    this.selectedUser = user;
    this.assignmentForm.patchValue({ userId: user._id });
    this.changeDetectorRef.markForCheck();
  }

  saveAssignment(): void {
    if (this.assignmentForm.invalid || !this.selectedRole?._id) {
      this.assignmentForm.markAllAsTouched();
      return;
    }
    const payload: CreateRoleAssignmentPayload = {
      ...(this.assignmentForm.value as CreateRoleAssignmentPayload),
      roleId: this.selectedRole._id,
    };
    this.assignmentsLoading = true;
    this.rolesService.createAssignment(payload).subscribe({
      next: () => {
        this.assignmentForm.reset({
          userId: '',
          scope: 'global',
          projectId: '',
          resourceId: '',
        });
        this.selectedUser = undefined;
        this.userSearch.reset();
        if (this.selectedRole?._id) {
          this.loadAssignments(this.selectedRole._id);
        }
      },
      error: () => {
        this.assignmentsLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  removeAssignment(id?: string): void {
    if (!id || !this.selectedRole?._id) {
      return;
    }
    this.assignmentsLoading = true;
    this.rolesService.deleteAssignment(id).subscribe({
      next: () => this.loadAssignments(this.selectedRole?._id as string),
      error: () => {
        this.assignmentsLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  userDisplay(user?: RoleUser | string): string {
    if (!user || typeof user === 'string') {
      return '';
    }
    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();
    return fullName || user.email || user.username || '';
  }

  permissionLabel(permission: string): string {
    return permission || this.translocoService.translate('permission');
  }
}
