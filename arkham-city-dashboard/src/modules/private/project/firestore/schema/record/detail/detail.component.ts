import { ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RecordComponent } from '@modules/private/project/firestore/schema/record/record.component';

@Component({
  selector: 'project-firestore-schema-record-detail',
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DetailComponent implements OnInit {
  private readonly recordComponent = inject(RecordComponent);

  ngOnInit() {
    this.recordComponent.drawer.open();
  }
}
