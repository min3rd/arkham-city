import { ChangeDetectionStrategy, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ListComponent } from '@modules/private/project/firestore/schema/list/list.component';
import { CommonModule } from '@angular/common';
import {
  ArkDatatable,
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
  BaseListComponent,
  Pagination,
} from 'arkhamcity';
import { SchemaService } from '@modules/private/project/firestore/schema/schema.service';
import { takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'project-firestore-schema-record',
  imports: [CommonModule, ArkDatatable, RouterModule, ArkDrawerContainer, ArkDrawerContent, ArkDrawer],
  templateUrl: './record.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RecordComponent extends BaseListComponent {
  @ViewChild('drawer', { static: true }) drawer!: ArkDrawer;
  pageRecord!: Pagination<any>;
  pageSize = 10;
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

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribeAll)).subscribe(params => {
      if ('size' in params) {
        this.pageSize = +params['size'];
      }
    });
  }

  onPageChange(page: number) {
    this.router.navigate(['../../', page, this.pageSize], {
      relativeTo: this.activatedRoute,
    });
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = +pageSize;
    this.router.navigate(['../', this.pageSize], {
        relativeTo: this.activatedRoute,
      },
    );
  }

  onSearch(search: string) {
    if (!search) {
      search = 'all';
    }
    this.router.navigate(['../../../', search], {
      relativeTo: this.activatedRoute,
    });
  }
}
