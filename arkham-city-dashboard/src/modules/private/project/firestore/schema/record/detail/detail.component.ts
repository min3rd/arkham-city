import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { RecordComponent } from '@modules/private/project/firestore/schema/record/record.component';
import { SchemaService } from '@modules/private/project/firestore/schema/schema.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'project-firestore-schema-record-detail',
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DetailComponent implements OnInit, OnDestroy {
  record!: any;

  private readonly recordComponent = inject(RecordComponent);
  private readonly schemaService = inject(SchemaService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private _unsubscribeAll = new Subject();

  ngOnInit() {
    this.recordComponent.drawer.open();

    this.schemaService.record$.pipe(takeUntil(this._unsubscribeAll)).subscribe(record => {
      this.record = record;
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
