import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  CreateRoleAssignmentPayload,
  RolesService,
  UpsertRolePayload,
} from './roles.service';
import { ConfigService } from '@core/services/config.service';

describe('RolesService', () => {
  let service: RolesService;
  let httpMock: HttpTestingController;
  const configMock = {
    endpoint: (path: string) => `/api${path}`,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RolesService,
        { provide: ConfigService, useValue: configMock },
      ],
    });

    service = TestBed.inject(RolesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list roles', () => {
    const roles = [{ _id: '1', name: 'admin' }];
    service.list().subscribe((res) => {
      expect(res).toEqual(roles as any);
    });
    const req = httpMock.expectOne('/api/roles');
    expect(req.request.method).toBe('GET');
    req.flush({ data: roles });
  });

  it('should create role', () => {
    const payload: UpsertRolePayload = {
      name: 'viewer',
      permissions: [],
    };
    service.create(payload).subscribe((res) => {
      expect(res?.name).toBe('viewer');
    });
    const req = httpMock.expectOne('/api/roles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ data: { _id: '2', ...payload } });
  });

  it('should update role', () => {
    const payload: UpsertRolePayload = {
      name: 'editor',
      permissions: ['project:write'],
    };
    service.update('role-1', payload).subscribe((res) => {
      expect(res?.permissions).toContain('project:write');
    });
    const req = httpMock.expectOne('/api/roles/role-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({ data: { _id: 'role-1', ...payload } });
  });

  it('should delete role', () => {
    service.delete('role-1').subscribe((res) => {
      expect(res).toBeTrue();
    });
    const req = httpMock.expectOne('/api/roles/role-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ data: true });
  });

  it('should list assignments with role filter', () => {
    service.listAssignments({ roleId: 'role-1' }).subscribe((res) => {
      expect(res[0]?.role).toBe('role-1' as any);
    });
    const req = httpMock.expectOne(
      (r) =>
        r.url === '/api/roles/assignments' &&
        r.params.get('roleId') === 'role-1',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [{ _id: 'a1', role: 'role-1' }] });
  });

  it('should create assignment', () => {
    const payload: CreateRoleAssignmentPayload = {
      userId: 'user-1',
      roleId: 'role-1',
      scope: 'global',
    };
    service.createAssignment(payload).subscribe((res) => {
      expect(res?.user).toBe(payload.userId as any);
    });
    const req = httpMock.expectOne('/api/roles/assignments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ data: { _id: 'assign-1', user: payload.userId } });
  });

  it('should delete assignment', () => {
    service.deleteAssignment('assign-1').subscribe((res) => {
      expect(res).toBeTrue();
    });
    const req = httpMock.expectOne('/api/roles/assignments/assign-1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ data: true });
  });

  it('should search users', () => {
    service.searchUsers('john', 5).subscribe((res) => {
      expect(res[0]?.email).toBe('john@example.com');
    });
    const req = httpMock.expectOne(
      (r) =>
        r.url === '/api/roles/users' &&
        r.params.get('q') === 'john' &&
        r.params.get('limit') === '5',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [{ _id: 'u1', email: 'john@example.com' }] });
  });
});
