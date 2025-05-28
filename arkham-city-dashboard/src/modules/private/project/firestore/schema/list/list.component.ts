import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ArkButton,
  ArkDatatable,
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
  ArkPaginator,
  ArkTextInput,
  BaseListComponent,
  CapitalizePipe,
  Pagination,
} from 'arkhamcity';
import { SchemaResDto } from '@modules/private/project/firestore/schema/schema.types';
import { SchemaService } from '@modules/private/project/firestore/schema/schema.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'project-firestore-schema-list',
  imports: [
    CommonModule,
    RouterModule,
    ArkDrawerContainer,
    ArkDrawer,
    ArkDrawerContent,
    ArkTextInput,
    CapitalizePipe,
    ArkButton,
    ArkTextInput,
    ArkPaginator,
    ArkDatatable,
  ],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseListComponent implements OnInit {
  @ViewChild('drawer', { static: true }) drawer!: ArkDrawer;
  pageSchema!: Pagination<SchemaResDto>;
  pageSize = 10;
  private readonly schemaService = inject(SchemaService);

  override ngOnInit() {
    this.schemaService.pageSchema$.pipe(takeUntil(this.unsubscribeAll)).subscribe(page => {
      this.pageSchema = page;
      this.changeDetectorRef.markForCheck();
    });

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribeAll)).subscribe(params => {
      if ('size' in params) {
        this.pageSize = +params['size'];
      }
    });
  }

  onSearch(search: string) {
    if (!search) {
      search = 'all';
    }
    this.router.navigate(['../../../', search], {
      relativeTo: this.activatedRoute,
    });
  }

  onPageChange(page: any) {
    this.router.navigate(['../../', page, this.pageSize], {
      relativeTo: this.activatedRoute,
    });
  }

  onPageSizeChange(pageSize: any) {
    this.pageSize = parseInt(pageSize);
    this.router.navigate(['../', this.pageSize], {
      relativeTo: this.activatedRoute,
    });
  }
}
