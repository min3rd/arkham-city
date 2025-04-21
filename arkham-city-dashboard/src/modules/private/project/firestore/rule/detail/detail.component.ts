import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../core/components/base/base.component';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArkTextInput } from '../../../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../../../../../core/components/buttons/ark-button/ark-button.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../../../core/pipe/capitalize.pipe';
import { ArkTabGroup, ArkTabTitle } from '../../../../../../core/components/tabs/ark-tab-group/ark-tab-group.component';
import { ArkTabContent } from '../../../../../../core/components/tabs/ark-tab-content/ark-tab-content.component';

@Component({
  selector: 'project-firestore-rule-detail',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ArkTextInput, ArkButton, TranslocoModule, CapitalizePipe, ArkTabGroup, ArkTabContent],
  templateUrl: './detail.component.html',
})
export class DetailComponent extends BaseComponent {
  tabs: ArkTabTitle[] = [
    {
      id: 'rules',
      title: 'Rules',
      icon: 'featherActivity',
    },
    {
      id: 'schema',
      title: 'Schema',
      icon: 'featherActivity',
      disabled: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'featherSettings',
    },
  ];

  override ngOnInit() {
    super.ngOnInit();
    this.form = this.formBuilder.group({
      schema: ['', [Validators.required]],
    });
  }
}
