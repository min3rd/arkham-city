import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'empty-layout',
  imports: [RouterModule],
  templateUrl: './empty-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyLayoutComponent implements OnInit {
  ngOnInit(): void {}
}
