import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkDropdownComponent } from './ark-dropdown.component';

describe('ArkDropdownComponent', () => {
  let component: ArkDropdownComponent;
  let fixture: ComponentFixture<ArkDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArkDropdownComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArkDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
