import { Component, Input, Output, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../base/base/base.component';
import { ArkButton } from '../../buttons/ark-button/ark-button.component';
import { ArkSelect } from '../../selects/ark-select/ark-select.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ark-paginator',
  exportAs: 'arkPaginator',
  imports: [ArkButton, ArkSelect, FormsModule],
  templateUrl: './ark-paginator.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkPaginator extends BaseComponent {
  @Input() page!: number;
  @Input() pageSize!: number;
  @Input() total!: number;
  @Input() count!: number;
  @Input() pageSizeOptions!: number[];

  @Output() pageChange: (page: number) => void = () => {
  };
  @Output() pageSizeChange: (pageSize: number) => void = () => {
  };
}
