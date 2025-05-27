import { ChangeDetectionStrategy, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ArkButton,
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
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'project-firestore-schema-list',
  imports: [
    CommonModule,
    RouterModule,
    ArkDrawerContainer,
    ArkDrawer,
    ArkDrawerContent,
    ArkTextInput,
    TranslocoPipe,
    CapitalizePipe,
    ArkButton,
    ReactiveFormsModule,
    ArkTextInput,
    ArkPaginator,
  ],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseListComponent {
  @ViewChild('drawer', { static: true }) drawer!: ArkDrawer;
  pageSchema!: Pagination<SchemaResDto>;
  pageSize = 10;

  form!: UntypedFormGroup;

  private readonly schemaService = inject(SchemaService);
  private readonly formBuilder = inject(FormBuilder);

  override ngOnInit() {
    this.schemaService.pageSchema$.pipe(takeUntil(this.unsubscribeAll)).subscribe(page => {
      this.pageSchema = page;
      this.changeDetectorRef.markForCheck();
    });

    this.form = this.formBuilder.group({
      'search': [''],
    });

    this.activatedRoute.params.pipe(takeUntil(this.unsubscribeAll)).subscribe(params => {
      if ('query' in params && params['query'] !== 'all') {
        this.form.get('search')?.setValue(params['query']);
      }

      if ('size' in params) {
        this.pageSize = +params['size'];
      }
    });
  }

  search() {
    let search = this.form.get('search')?.getRawValue();
    if (!this.form.get('search')?.getRawValue()) {
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
