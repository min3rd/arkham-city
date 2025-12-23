import { Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../base/base/base.component';
import { ArkTextInput } from '../../inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../buttons/ark-button/ark-button.component';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { TranslocoModule } from '@jsverse/transloco';

import { ArkPaginator } from '../../paginators/ark-paginator/ark-paginator.component';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'ark-datatable',
  exportAs: 'arkDatatable',
  imports: [
    TranslocoModule,
    CapitalizePipe,
    ArkTextInput,
    ArkButton,
    ArkPaginator,
    ReactiveFormsModule
],
  templateUrl: './ark-datatable.component.html',
  styleUrl: './ark-datatable.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkDatatable extends BaseComponent implements OnInit {
  @Input() page!: number;
  @Input() pageSize!: number;
  @Input() total!: number;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() data!: any[];
  @Input() disablePageSelector: boolean | string = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();

  form!: UntypedFormGroup;
  formBuilder = inject(UntypedFormBuilder);

  ngOnInit() {
    this.form = this.formBuilder.group({
      'search': [''],
    });
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onPageSizeChange(pageSize: number) {
    this.pageSizeChange.emit(pageSize);
  }

  onSearch() {
    this.search.emit(this.form.get('search')?.getRawValue());
  }
}
