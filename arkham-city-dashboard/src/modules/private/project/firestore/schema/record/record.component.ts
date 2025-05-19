import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ListComponent } from '@modules/private/project/firestore/schema/list/list.component';

@Component({
  selector: 'project-firestore-schema-record',
  imports: [],
  templateUrl: './record.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class RecordComponent implements OnInit {

  constructor(
    private readonly listComponent: ListComponent,
  ) {
  }

  ngOnInit() {
    this.listComponent.drawer.open();
  }

}
