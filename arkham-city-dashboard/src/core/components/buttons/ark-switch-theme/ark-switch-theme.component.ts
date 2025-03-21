import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'ark-switch-theme',
  imports: [],
  templateUrl: './ark-switch-theme.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArkSwitchThemeComponent implements OnInit {

  ngOnInit(): void { }

}
