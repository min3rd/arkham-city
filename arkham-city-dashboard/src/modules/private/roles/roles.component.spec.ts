import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesComponent } from './roles.component';
import { RolesService } from './roles.service';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;

  const rolesServiceMock = {
    list: jasmine.createSpy('list').and.returnValue(of([])),
    listAssignments: jasmine
      .createSpy('listAssignments')
      .and.returnValue(of([])),
    searchUsers: jasmine.createSpy('searchUsers').and.returnValue(of([])),
    create: jasmine.createSpy('create').and.returnValue(of(null)),
    update: jasmine.createSpy('update').and.returnValue(of(null)),
    delete: jasmine.createSpy('delete').and.returnValue(of(true)),
    createAssignment: jasmine
      .createSpy('createAssignment')
      .and.returnValue(of(null)),
    deleteAssignment: jasmine
      .createSpy('deleteAssignment')
      .and.returnValue(of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesComponent],
      providers: [
        { provide: RolesService, useValue: rolesServiceMock },
        { provide: TranslocoService, useValue: { translate: (key: string) => key } },
      ],
    })
      .overrideComponent(RolesComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter roles by search and permission', () => {
    component.roles = [
      { _id: '1', name: 'Admin', permissions: ['roles:write'] },
      { _id: '2', name: 'Viewer', permissions: ['project:read'], default: true },
    ];
    component.filtersForm.patchValue({ search: 'view', defaultOnly: false, permission: 'project' });
    (component as any).applyFilters();
    expect(component.filteredRoles.length).toBe(1);
    expect(component.filteredRoles[0].name).toBe('Viewer');
  });

  it('should toggle permissions', () => {
    component.selectedPermissions = new Set<string>(['roles:write']);
    component.togglePermission('project:read');
    expect(component.selectedPermissions.has('project:read')).toBeTrue();
    component.togglePermission('roles:write');
    expect(component.selectedPermissions.has('roles:write')).toBeFalse();
  });

  it('should validate permission format', () => {
    expect((component as any).isValidPermission('project:read')).toBeTrue();
    expect((component as any).isValidPermission('project.read')).toBeTrue();
    expect((component as any).isValidPermission('invalid')).toBeFalse();
  });

  it('should merge available permissions', () => {
    component.roles = [{ _id: '1', name: 'RoleA', permissions: ['custom:perm'] }];
    component.selectedPermissions = new Set<string>(['extra:perm']);
    const available = component.availablePermissions();
    expect(available).toContain('custom:perm');
    expect(available).toContain('extra:perm');
    expect(available).toContain('roles:write');
  });
});
