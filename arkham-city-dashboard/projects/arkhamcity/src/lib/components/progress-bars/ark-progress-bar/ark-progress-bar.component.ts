import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ProgressBarType } from '../progress-bar.types';
import { BaseComponent } from '../../base/base/base.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ark-progress-bar',
  exportAs: 'arkProgressBar',
  imports: [CommonModule],
  templateUrl: './ark-progress-bar.component.html',
  styleUrl: './ark-progress-bar.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class ArkProgressBar extends BaseComponent implements OnInit {
  @Input() mode: ProgressBarType = 'determinate';
  @Input() value = 0;

  loading = false;

  ngOnInit() {
    if (!this.mode) {
      this.mode = 'determinate';
    }
  }
}
