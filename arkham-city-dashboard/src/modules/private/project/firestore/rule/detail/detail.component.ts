import { Component, inject } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { BaseFormComponent } from '../../../../../../core/components/base/base-form.component';
import { ArkSelect } from '../../../../../../core/components/selects/ark-select/ark-select.component';
import { ProjectResDto } from '../../../project.types';
import { ProjectService } from '../../../project.service';
import { SchemaRuleResDto } from '../rule.types';

@Component({
  selector: 'projects-firestore-rules-detail',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ArkTextInput, ArkButton, TranslocoModule, CapitalizePipe, ArkTabGroup, ArkTabContent, ArkSelect],
  templateUrl: './detail.component.html',
})
export class DetailComponent extends BaseFormComponent {
  tabs!: ArkTabTitle[] | undefined;
  ruleConditionTypes!: string[] | null;
  project!: ProjectResDto | null;
  schemaRule!: SchemaRuleResDto | null;
  private ruleService = inject(RuleService);
  private projectService = inject(ProjectService);

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

    this.projectService.project$.pipe(takeUntil(this.unsubscribeAll)).subscribe(project => {
      this.project = project;
      this.changeDetectorRef.markForCheck();
    });

    this.ruleService.rule$.pipe(takeUntil(this.unsubscribeAll)).subscribe(rule => {
      this.schemaRule = rule;
      if (rule) {
        this.newForm();
        if (rule.rules && rule.rules.length > 0) {
          for (const _ of rule.rules) {
            const index = this.tabs?.findIndex(e => e.id === _.type);
            if (index !== undefined && index !== null && index >= 0) {
              this.newCondition(index);
            }
          }
        }
        this.form.patchValue(rule);
      }
    });
  }

  newForm() {
    this.form = this.formBuilder.group({
      schema: ['', [Validators.required]],
      rules: this.formBuilder.array([]),
    });
    if (!this.tabs) {
      return;
    }
    for (const tab of this.tabs) {
      (this.form.get('rules') as FormArray)?.push(this.formBuilder.group({
        type: [tab.id, [Validators.required]],
        conditions: this.formBuilder.array([]),
      }));
    }
  }

  newCondition(index: number) {
    const conditions = ((this.form.get('rules') as FormArray).at(index) as FormGroup).get('conditions') as FormArray;
    conditions.push(this.formBuilder.group({
      condition: ['', [Validators.required]],
      customCondition: [''],
    }));
    this.changeDetectorRef.markForCheck();
  }

  getConditionControls(index: number) {
    const conditions = ((this.form.get('rules') as FormArray).at(index) as FormGroup).get('conditions') as FormArray;
    return conditions.controls;
  }

  create() {
    if (!this.project) {
      return;
    }
    if (this.form.invalid) {
      return;
    }
    this.ruleService.create(this.project._id, this.form.getRawValue()).subscribe(res => {
      console.log(res);
    });
  }

  update() {

  }
}
