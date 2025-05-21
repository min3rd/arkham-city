import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkDatatable } from './ark-datatable.component';

describe('ArkDatatableComponent', () => {
  let component: ArkDatatable;
  let fixture: ComponentFixture<ArkDatatable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArkDatatable],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ArkDatatable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
