
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  type OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import * as feathers from '@ng-icons/feather-icons';
import { TranslocoModule } from '@jsverse/transloco';
import { UserResDto } from '../../auth/auth.type';
import { AuthService } from '../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import {
  ArkButton,
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
  ArkLoading,
  ArkNavigation,
  ArkSelect,
  ArkSwitchTheme,
  ArkUser,
  CapitalizePipe,
  NavigationItem,
  NavigationService,
} from 'arkhamcity';
import { ProjectResDto } from '@modules/private/project/project.types';
import { ProjectService } from '@modules/private/project/project.service';

@Component({
  selector: 'main-layout',
  imports: [
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
    ArkLoading
],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ ...feathers })],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: ArkDrawer;

  openDrawer = false;
  drawerMode: 'over' | 'side' = 'side';

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

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Check screen size on initialization
    this.checkScreenSize();

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
        this.navigations = this.filterNavigations(
          this.navigationService.navigations(project?._id ?? 'no-project-id'),
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

  private filterNavigations(items: NavigationItem[]): NavigationItem[] {
    const filtered: NavigationItem[] = [];
    items.forEach((item) => {
      if (
        item.permissions &&
        !this.authService.hasAllPermissions(item.permissions)
      ) {
        return;
      }
      const clone: NavigationItem = {
        ...item,
      };
      if (clone.children && clone.children.length > 0) {
        clone.children = this.filterNavigations(clone.children);
      }
      filtered.push(clone);
    });
    return filtered;
  }

  /**
   * Checks the screen size and sets the drawer mode accordingly
   * - For screens smaller than 768px (smartphones), use 'over' mode
   * - For screens 768px and larger (tablets and desktops), use 'side' mode
   */
  checkScreenSize() {
    const isSmallScreen = window.innerWidth < 768;
    this.openDrawer = !isSmallScreen;
    this.drawerMode = isSmallScreen ? 'over' : 'side';

    // If drawer is open and we're switching to small screen, close it
    if (isSmallScreen && this.openDrawer && this.drawer) {
      this.openDrawer = false;
      this.drawer.close();
    }

    this.changeDetectorRef.markForCheck();
  }
}
