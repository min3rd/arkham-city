import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { ListComponent } from '@modules/private/project/firestore/schema/list/list.component';
import { CommonModule } from '@angular/common';
import { ArkDatatable, BaseListComponent, CdkListItemDirective } from 'arkhamcity';
import { SchemaService } from '@modules/private/project/firestore/schema/schema.service';
import { Pagination } from '../../../../../../../projects/arkhamcity/src/lib/type/pagination.types';
import { takeUntil } from 'rxjs';


@Component({
  selector: 'project-firestore-schema-record',
  imports: [CommonModule, ArkDatatable, CdkListItemDirective],
  templateUrl: './record.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RecordComponent extends BaseListComponent {
  pageRecord!: Pagination<any>;
  private readonly schemaService = inject(SchemaService);

  constructor(
    private readonly listComponent: ListComponent,
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.listComponent.drawer.open();

    this.schemaService.pageRecords$.pipe(takeUntil(this.unsubscribeAll)).subscribe(page => {
      this.pageRecord = page;
      this.changeDetectorRef.markForCheck();
    });
  }
}
