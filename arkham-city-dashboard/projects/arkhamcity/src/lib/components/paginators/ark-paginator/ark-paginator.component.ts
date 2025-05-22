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
    const totalPages = Math.ceil(this.total / this.pageSize);
    const currentPage = +this.page;
    const options: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        options.push(i);
      }
      return options;
    }

    options.push(1);

    if (currentPage > 4) {
      options.push(-1); // Ellipsis
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 4) {
      end = 4;
    }
    if (currentPage >= totalPages - 3) {
      start = totalPages - 3;
    }

    for (let i = start; i <= end; i++) {
      options.push(i);
    }

    if (currentPage < totalPages - 3) {
      options.push(-1); // Ellipsis
    }

    options.push(totalPages);

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
