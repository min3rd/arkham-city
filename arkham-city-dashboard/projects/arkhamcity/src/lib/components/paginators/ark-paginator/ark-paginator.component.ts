import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Output() pageChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();

  getPageOptions(): number[] {
    const options: number[] = [];
    for (let i = 1; i <= Math.ceil(this.total / this.pageSize); i++) {
      options.push(i);
    }
    return options;
  }

  onPageChange(page: number): void {
    this.page = page;
    this.pageChange.emit(this.page);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageSizeChange.emit(this.pageSize);
    this.page = 1; // Reset to first page when page size changes
    this.pageChange.emit(this.page);
  }
}
