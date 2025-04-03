import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseComponent } from '../../../../../core/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArkTextInput } from '../../../../../core/components/inputs/ark-text-input/ark-text-input.component';
import { ArkButton } from '../../../../../core/components/buttons/ark-button/ark-button.component';
import { TranslocoModule } from '@jsverse/transloco';
import { CapitalizePipe } from '../../../../../core/pipe/capitalize.pipe';
import { ArkSelect } from '../../../../../core/components/selects/ark-select/ark-select.component';
import { ArkTextarea } from '../../../../../core/components/textareas/ark-textarea/ark-textarea.component';
import { AppResDto, ProjectResDto } from '../app.type';
import { AppService } from '../app.service';
import { takeUntil } from 'rxjs';
import { ProjectService } from '../../project.service';
import { RouterModule } from '@angular/router';
import { ListComponent } from '../list/list.component';
import { ArkClipboardDirective } from '../../../../../core/directives/ark-clipboard.directive';

@Component({
  selector: 'app-detail',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    RouterModule,
    CapitalizePipe,
    ArkTextInput,
    ArkButton,
    ArkSelect,
    ArkTextarea,
    ArkClipboardDirective,
  ],
  templateUrl: './detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent extends BaseComponent {
  app!: AppResDto | null;
  project!: ProjectResDto | null;
  private appService: AppService = inject(AppService);
  private projectService: ProjectService = inject(ProjectService);
  private listComponent: ListComponent = inject(ListComponent);
  override ngOnInit(): void {
    super.ngOnInit();
    this.listComponent.drawer.open();
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      callback: ['', [Validators.required]],
      description: [''],
    });

    this.projectService.project$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.markForCheck();
      });

    this.appService.app$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((app) => {
        this.app = app;
        this.form.reset();
        if (this.app) {
          this.form.patchValue({ ...this.app });
        }
        this.changeDetectorRef.markForCheck();
      });
  }
  closeDrawer() {
    this.listComponent.drawer.close();
  }
  create() {
    if (this.form.invalid) {
      return;
    }
    if (!this.project) {
      return;
    }
    if (this.app) {
      return;
    }
    // create new app
    this.appService
      .create(this.project._id, this.form.getRawValue())
      .subscribe();
  }

  update() {
    if (this.form.invalid) {
      return;
    }
    if (!this.project) {
      return;
    }
    if (!this.app) {
      return;
    }
    this.appService
      .update(this.project._id, this.app._id, this.form.getRawValue())
      .subscribe();
  }
}
