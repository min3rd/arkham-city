import { TestBed } from '@angular/core/testing';

import { ArkhamcityService } from './arkhamcity.service';

describe('ArkhamcityService', () => {
  let service: ArkhamcityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArkhamcityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
