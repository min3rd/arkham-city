import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@core/services/config.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, UsersService],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
    configService.appConfig = { apiUrl: 'http://api.test' } as any;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list users with query params', () => {
    const mockResponse = {
      items: [],
      total: 0,
      page: 2,
      limit: 5,
    };
    service
      .list({ search: 'john', roleId: 'role-1', status: 'active', page: 2, limit: 5 })
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      (r) =>
        r.url === 'http://api.test/v1/users' &&
        r.params.get('search') === 'john' &&
        r.params.get('roles') === 'role-1' &&
        r.params.get('status') === 'active' &&
        r.params.get('page') === '2' &&
        r.params.get('limit') === '5',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockResponse });
  });

  it('should update status', () => {
    service.setStatus('user-1', 'disabled').subscribe((res) => {
      expect(res?.status).toBe('disabled');
    });
    const req = httpMock.expectOne(
      (r) => r.url === 'http://api.test/v1/users/user-1/status',
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'disabled' });
    req.flush({ data: { _id: 'user-1', status: 'disabled' } });
  });
});
