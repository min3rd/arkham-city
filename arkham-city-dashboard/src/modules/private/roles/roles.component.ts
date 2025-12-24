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
import { ParamMap } from '@angular/router';
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
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  takeUntil,
} from 'rxjs';

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
  private syncingFromRoute = false;

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
    sort: [''],
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
  bulkPermission = new FormControl<string>('');

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
  bulkSelection: Set<string> = new Set<string>();
  expandedBadges: Set<string> = new Set<string>();
  bulkLoading = false;

  override ngOnInit(): void {
    this.restoreStateFromRoute(this.activatedRoute.snapshot.queryParamMap);
    this.loadRoles(this.activatedRoute.snapshot.paramMap.get('id') ?? undefined);
    this.activatedRoute.queryParamMap
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((params) => this.restoreStateFromRoute(params));
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((params) => this.handleRouteRoleChange(params));
    this.filtersForm.valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        this.applyFilters(1);
        this.persistState();
      });
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
    this.bulkSelection.clear();
    this.navigateWithState();
    this.changeDetectorRef.markForCheck();
  }

  selectRole(role: RoleResDto, options?: { skipNav?: boolean }): void {
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
    if (!options?.skipNav) {
      this.navigateWithState(role._id);
    }
  }

  closeDrawer(): void {
    this.drawerOpened = false;
    this.selectedRole = null;
    this.navigateWithState();
    this.changeDetectorRef.markForCheck();
  }

  onSearch(search: string): void {
    this.filtersForm.patchValue({ search }, { emitEvent: true });
  }

  onPageChange(page: number): void {
    this.updatePage(page);
    this.persistState();
  }

  onPageSizeChange(size: number): void {
    this.pageRoles.size = size;
    this.updatePage(1);
    this.persistState();
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

  deleteRoleById(role: RoleResDto): void {
    if (!role._id) {
      return;
    }
    this.loadingRoles = true;
    this.rolesService.delete(role._id).subscribe({
      next: () => {
        if (this.selectedRole?._id === role._id) {
          this.closeDrawer();
        }
        this.bulkSelection.delete(role._id as string);
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

  toggleBadgeExpansion(roleId?: string): void {
    if (!roleId) {
      return;
    }
    if (this.expandedBadges.has(roleId)) {
      this.expandedBadges.delete(roleId);
    } else {
      this.expandedBadges.add(roleId);
    }
    this.changeDetectorRef.markForCheck();
  }

  permissionsPreview(role: RoleResDto): string[] {
    if (this.expandedBadges.has(role._id ?? '')) {
      return role.permissions ?? [];
    }
    return (role.permissions ?? []).slice(0, 3);
  }

  remainingPermissions(role: RoleResDto): number {
    const total = role.permissions?.length ?? 0;
    return total > 3 ? total - 3 : 0;
  }

  toggleBulkSelection(roleId?: string, checked?: boolean): void {
    if (!roleId) {
      return;
    }
    if (checked) {
      this.bulkSelection.add(roleId);
    } else {
      this.bulkSelection.delete(roleId);
    }
    this.changeDetectorRef.markForCheck();
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.pageRoles.data
        .map((role) => role._id)
        .filter(Boolean)
        .forEach((id) => this.bulkSelection.add(id as string));
    } else {
      this.pageRoles.data
        .map((role) => role._id)
        .filter(Boolean)
        .forEach((id) => this.bulkSelection.delete(id as string));
    }
    this.changeDetectorRef.markForCheck();
  }

  isSelected(roleId?: string): boolean {
    return roleId ? this.bulkSelection.has(roleId) : false;
  }

  bulkDeleteSelected(): void {
    const ids = Array.from(this.bulkSelection);
    if (ids.length === 0) {
      return;
    }
    this.bulkLoading = true;
    forkJoin(ids.map((id) => this.rolesService.delete(id))).subscribe({
      next: () => {
        this.bulkSelection.clear();
        this.bulkLoading = false;
        this.loadRoles();
      },
      error: () => {
        this.bulkLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  bulkAssign(mode: 'assign' | 'revoke'): void {
    const permission = (this.bulkPermission.value ?? '').trim();
    if (!permission || !this.isValidPermission(permission)) {
      return;
    }
    const ids = Array.from(this.bulkSelection);
    if (ids.length === 0) {
      return;
    }
    this.bulkLoading = true;
    const updates = ids
      .map((id) => this.roles.find((role) => role._id === id))
      .filter((role): role is RoleResDto => !!role)
      .map((role) => {
        const current = new Set<string>(role.permissions ?? []);
        if (mode === 'assign') {
          current.add(permission);
        } else {
          current.delete(permission);
        }
        return this.rolesService.update(role!._id as string, {
          name: role.name,
          description: role.description,
          permissions: Array.from(current),
          default: role.default,
        });
      });
    if (updates.length === 0) {
      this.bulkLoading = false;
      return;
    }
    forkJoin(updates).subscribe({
      next: () => {
        this.bulkPermission.reset();
        this.bulkLoading = false;
        this.loadRoles();
      },
      error: () => {
        this.bulkLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  duplicateRole(role: RoleResDto): void {
    this.selectedRole = null;
    this.drawerOpened = true;
    this.activeTab = 0;
    const baseName = `${role.name} Copy`;
    const existing = new Set(this.roles.map((r) => r.name));
    let candidate = baseName;
    let counter = 2;
    while (existing.has(candidate)) {
      candidate = `${baseName} ${counter++}`;
    }
    this.roleForm.reset({
      id: '',
      name: candidate,
      description: role.description ?? '',
      default: false,
    });
    this.selectedPermissions = new Set<string>(role.permissions ?? []);
    this.navigateWithState();
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
        this.applyFilters(this.pageRoles.page);
        const targetId = focusId ?? this.activatedRoute.snapshot.paramMap.get('id');
        if (targetId) {
          const found = this.roles.find((r) => r._id === targetId);
          if (found) {
            this.selectRole(found, { skipNav: true });
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

  private applyFilters(page?: number): void {
    const { search, defaultOnly, permission, sort } = this.filtersForm.value;
    const normalizedSearch = (search ?? '').toLowerCase();
    const permissionFilter = (permission ?? '').toLowerCase();
    this.filteredRoles = this.roles
      .filter((role) => {
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
      })
      .sort((a, b) => {
        if (!sort) {
          return 0;
        }
        const [field, direction] = sort.split(':');
        const dir = direction === 'desc' ? -1 : 1;
        if (field === 'name') {
          return a.name.localeCompare(b.name) * dir;
        }
        return 0;
      });
    this.updatePage(page ?? 1);
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
    if (!opened) {
      this.navigateWithState();
    }
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

  private restoreStateFromRoute(params: ParamMap): void {
    this.syncingFromRoute = true;
    const page = Number(params.get('page') ?? this.pageRoles.page) || 1;
    const size =
      Number(params.get('limit') ?? this.pageRoles.size) || this.pageRoles.size;
    const search = params.get('search') ?? '';
    const permission = params.get('permission') ?? '';
    const defaultOnly = params.get('defaultOnly') === 'true';
    const sort = params.get('sort') ?? '';
    this.pageRoles.page = page;
    this.pageRoles.size = size;
    this.filtersForm.patchValue(
      { search, permission, defaultOnly, sort },
      { emitEvent: false },
    );
    this.applyFilters(this.pageRoles.page);
    this.syncingFromRoute = false;
  }

  private persistState(): void {
    const activeRoleId =
      this.selectedRole?._id ??
      this.activatedRoute.snapshot.paramMap.get('id') ??
      undefined;
    this.navigateWithState(activeRoleId || undefined);
  }

  private navigateWithState(roleId?: string): void {
    if (this.syncingFromRoute) {
      return;
    }
    const commands = roleId ? ['/roles', roleId] : ['/roles'];
    this.router.navigate(commands, {
      queryParams: this.buildQueryParams(),
      replaceUrl: true,
    });
  }

  private buildQueryParams(): Record<string, unknown> {
    const { search, defaultOnly, permission, sort } = this.filtersForm.value;
    return {
      page: this.pageRoles.page,
      limit: this.pageRoles.size,
      ...(search ? { search } : {}),
      ...(permission ? { permission } : {}),
      ...(sort ? { sort } : {}),
      ...(defaultOnly ? { defaultOnly: true } : {}),
    };
  }

  private handleRouteRoleChange(params: ParamMap): void {
    const roleId = params.get('id');
    if (!roleId) {
      this.drawerOpened = false;
      this.selectedRole = null;
      this.changeDetectorRef.markForCheck();
      return;
    }
    const found = this.roles.find((r) => r._id === roleId);
    if (found) {
      this.selectRole(found, { skipNav: true });
    }
  }
}
