import { ChangeDetectionStrategy, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ArkButton,
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
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
  ],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseListComponent {
  @ViewChild('drawer') drawer!: ArkDrawer;
  pageSchema!: Pagination<SchemaResDto>;

  form!: UntypedFormGroup;

  private readonly schemaService = inject(SchemaService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly activatedRoute = inject(ActivatedRoute);

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
}
