import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkhamcityComponent } from './arkhamcity.component';

describe('ArkhamcityComponent', () => {
  let component: ArkhamcityComponent;
  let fixture: ComponentFixture<ArkhamcityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArkhamcityComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArkhamcityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
