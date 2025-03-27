import { Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'ark-divider',
  imports: [],
  templateUrl: './ark-divider.component.html',
})
export class ArkDivider implements OnInit {
  @Input() label!: string;
  ngOnInit(): void {}
}
