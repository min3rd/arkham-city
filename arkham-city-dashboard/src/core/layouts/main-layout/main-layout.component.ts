import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  type OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  ArkSwitchTheme,
} from '../../../../projects/arkhamcity/src/lib/components/buttons/ark-switch-theme/ark-switch-theme.component';
import { provideIcons } from '@ng-icons/core';
import * as feathers from '@ng-icons/feather-icons';
import { TranslocoModule } from '@jsverse/transloco';
import { ArkNavigation } from '../../../../projects/arkhamcity/src/lib/components/navigation/navigation.component';
import { NavigationItem } from '../../../../projects/arkhamcity/src/lib/components/navigation/navigation.type';
import { ArkButton } from '../../../../projects/arkhamcity/src/lib/components/buttons/ark-button/ark-button.component';
import { ArkSelect } from '../../../../projects/arkhamcity/src/lib/components/selects/ark-select/ark-select.component';
import { ArkUser } from '../../../../projects/arkhamcity/src/lib/components/users/ark-user/ark-user.component';
import { UserResDto } from '../../auth/auth.type';
import { AuthService } from '../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ProjectResDto } from '../../../modules/private/project/project.types';
import { ProjectService } from '../../../modules/private/project/project.service';
import { CapitalizePipe } from '../../pipe/capitalize.pipe';
import { NavigationService } from '../../services/navigation.service';
import {
  ArkDrawerContainer,
} from '../../../../projects/arkhamcity/src/lib/components/drawers/ark-drawer-container/ark-drawer-container.component';
import { ArkDrawer } from '../../../../projects/arkhamcity/src/lib/components/drawers/ark-drawer/ark-drawer.component';
import {
  ArkDrawerContent,
} from '../../../../projects/arkhamcity/src/lib/components/drawers/ark-drawer-content/ark-drawer-content.component';

@Component({
  selector: 'main-layout',
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    CapitalizePipe,
    ArkSwitchTheme,
    ArkNavigation,
    ArkButton,
    ArkSelect,
    ArkUser,
    ArkDrawerContainer,
    ArkDrawer,
    ArkDrawerContent,
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ ...feathers })],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: ArkDrawer;

  user: UserResDto | null | undefined;
  projects!: ProjectResDto[] | null;
  project!: ProjectResDto | null;
  navigations!: NavigationItem[];
  private authService: AuthService = inject(AuthService);
  private projectService: ProjectService = inject(ProjectService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private navigationService: NavigationService = inject(NavigationService);
  private router: Router = inject(Router);
  private _unsubscribeAll = new Subject<any>();

  ngOnInit(): void {
    this.user = this.authService.user;
    this.projectService.projects$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((projects) => {
        this.projects = projects;
        if (!this.project && this.projects && this.projects.length > 0) {
          this.project = this.projects[0];
          this.projectService.select(this.project);
        }
        this.changeDetectorRef.markForCheck();
      });

    this.projectService.project$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((project) => {
        this.project = project;
        this.navigations = this.navigationService.navigations(
          project?._id ?? 'no-project-id',
        );
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onProjectChange(projectId: string) {
    const project = this.projects?.find((e) => e._id == projectId);
    if (!project) {
      return;
    }
    this.router.navigate([`/dashboard`]);
    this.projectService.select(project);
  }

  toggleDrawer() {
    this.drawer.toggle();
  }
}
