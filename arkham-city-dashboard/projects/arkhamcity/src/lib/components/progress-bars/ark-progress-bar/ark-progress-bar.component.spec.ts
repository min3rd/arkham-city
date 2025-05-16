import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkProgressBar } from './ark-progress-bar.component';

describe('ArkProgressBarComponent', () => {
  let component: ArkProgressBar;
  let fixture: ComponentFixture<ArkProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArkProgressBar],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArkProgressBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
