import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../base/base/base.component';
import { ArkTextInput } from '../../inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../buttons/ark-button/ark-button.component';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { TranslocoModule } from '@jsverse/transloco';
import { Pagination } from '../../../type/pagination.types';
import { CommonModule } from '@angular/common';
import { ArkPaginator } from '../../paginators/ark-paginator/ark-paginator.component';

@Component({
  selector: 'ark-datatable',
  exportAs: 'arkDatatable',
  imports: [
    CommonModule,
    TranslocoModule,
    CapitalizePipe,
    ArkTextInput,
    ArkButton,
    ArkPaginator,
  ],
  templateUrl: './ark-datatable.component.html',
  styleUrl: './ark-datatable.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkDatatable extends BaseComponent {
  @Input() page!: Pagination<any>;
}
