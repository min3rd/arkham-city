import { Component, ViewEncapsulation } from '@angular/core';
import { ListComponent } from '@modules/private/project/firestore/schema/list/list.component';
import { CommonModule } from '@angular/common';
import { ArkDatatable, BaseListComponent, CdkListItemDirective } from 'arkhamcity';


@Component({
  selector: 'project-firestore-schema-record',
  imports: [CommonModule, ArkDatatable, CdkListItemDirective],
  templateUrl: './record.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class RecordComponent extends BaseListComponent {

  constructor(
    private readonly listComponent: ListComponent,
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.listComponent.drawer.open();
  }
}
