import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BaseComponent } from '../../base/base/base.component';
import { ArkTextInput } from '../../inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../buttons/ark-button/ark-button.component';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { ArkPaginator } from '../../paginators/ark-paginator/ark-paginator.component';
import { CdkListItemDirective } from './cdk-list-item.directive';

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
export class ArkDatatable extends BaseComponent implements AfterContentInit, AfterViewInit {
  @Input() page!: number;
  @Input() pageSize!: number;
  @Input() total!: number;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() data!: any[];
  @Input() disablePageSelector: boolean | string = true;

  @ViewChild(CdkListItemDirective) listTemplate !: TemplateRef<any>;

  ngAfterContentInit() {
    console.log(this.listTemplate);
  }

  ngAfterViewInit() {
    console.log(this.listTemplate);
  }
}
