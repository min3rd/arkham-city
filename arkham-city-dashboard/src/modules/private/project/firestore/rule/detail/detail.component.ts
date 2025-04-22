import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../core/components/base/base.component';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArkTextInput } from '../../../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../../../../../core/components/buttons/ark-button/ark-button.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../../../core/pipe/capitalize.pipe';
import { ArkTabGroup, ArkTabTitle } from '../../../../../../core/components/tabs/ark-tab-group/ark-tab-group.component';
import { ArkTabContent } from '../../../../../../core/components/tabs/ark-tab-content/ark-tab-content.component';
import { RuleService } from '../rule.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'project-firestore-rule-detail',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ArkTextInput, ArkButton, TranslocoModule, CapitalizePipe, ArkTabGroup, ArkTabContent],
  templateUrl: './detail.component.html',
})
export class DetailComponent extends BaseComponent implements OnInit, OnDestroy {
  tabs!: ArkTabTitle[] | undefined;
  ruleConditionTypes!: string[] | null;
  private ruleService = inject(RuleService);

  override ngOnInit() {
    super.ngOnInit();
    this.newForm();
    this.ruleService.ruleTypes$.pipe(takeUntil(this.unsubscribeAll)).subscribe(ruleTypes => {
      this.tabs = ruleTypes?.map(e => ({ id: e, title: e }));
      this.newForm();
      this.changeDetectorRef.markForCheck();
    });
    this.ruleService.ruleConditionTypes$.pipe(takeUntil(this.unsubscribeAll)).subscribe(ruleConditionTypes => {
      this.ruleConditionTypes = ruleConditionTypes;
      this.changeDetectorRef.markForCheck();
    });
  }

  newForm() {
    this.form = this.formBuilder.group({
      schema: ['', [Validators.required]],
    });
    if (!this.tabs) {
      return;
    }
    for (const tab of this.tabs) {
      this.form.addControl(tab.id, this.formBuilder.group({
        conditions: this.formBuilder.array([]),
      }));
    }
  }

  newCondition(index: number) {
    const conditions = this.form.get(this.tabs![index].id)!.get('conditions') as UntypedFormArray;
    conditions.push(this.formBuilder.group({
      type: ['', [Validators.required]],
      customCondition: ['', [Validators.required]],
    }));
  }

  getConditionControls(index: number) {
    const condition = this.form.get(this.tabs![index].id)!.get('conditions') as UntypedFormArray;
    return condition.controls;
  }

  getChildFormControl(control: AbstractControl, name: string) {
    return control.get(name) as FormControl;
  }
}
