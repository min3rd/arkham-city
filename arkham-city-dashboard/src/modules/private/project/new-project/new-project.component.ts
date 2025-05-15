import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../core/pipe/capitalize.pipe';
import {
  ArkTextInput,
} from '../../../../../projects/arkhamcity/src/lib/components/inputs/ark-text-input/ark-text-input.component';
import {
  ArkButton,
} from '../../../../../projects/arkhamcity/src/lib/components/buttons/ark-button/ark-button.component';
import {
  ArkTextarea,
} from '../../../../../projects/arkhamcity/src/lib/components/textareas/ark-textarea/ark-textarea.component';
import { ProjectService } from '../project.service';
import { BaseFormComponent } from '../../../../../projects/arkhamcity/src/lib/components/base/base-form.component';

@Component({
  selector: 'projects-new-project',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    CapitalizePipe,
    ArkTextInput,
    ArkButton,
    ArkTextarea,
  ],
  templateUrl: './new-project.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProjectComponent extends BaseFormComponent implements OnInit {
  private projectService: ProjectService = inject(ProjectService);

  override ngOnInit(): void {
    super.ngOnInit();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  create() {
    if (this.form.invalid) {
      return;
    }
    this.projectService.create(this.form.getRawValue()).subscribe();
  }
}
