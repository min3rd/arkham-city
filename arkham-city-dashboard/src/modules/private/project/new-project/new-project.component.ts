import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../core/pipe/capitalize.pipe';
import { ArkTextInput } from '../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../../../core/components/buttons/ark-button/ark-button.component';
import { ArkTextarea } from '../../../../core/components/textareas/ark-textarea/ark-textarea.component';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-new-project',
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
export class NewProjectComponent extends BaseComponent {
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
