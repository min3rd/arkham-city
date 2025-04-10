import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take } from 'rxjs';
import { NewProjectReqDto, ProjectResDto } from './project.types';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../core/services/config.service';
import { ApiResponse } from '../../../core/type/response.type';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private _projects: BehaviorSubject<ProjectResDto[] | null> =
    new BehaviorSubject<ProjectResDto[] | null>(null);
  private _project: BehaviorSubject<ProjectResDto | null> =
    new BehaviorSubject<ProjectResDto | null>(null);
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);
  get projects$(): Observable<ProjectResDto[] | null> {
    return this._projects.asObservable();
  }
  get project$(): Observable<ProjectResDto | null> {
    return this._project.asObservable();
  }
  create(newProject: NewProjectReqDto) {
    return this._projects.pipe(
      take(1),
      switchMap((projects) => {
        return this.httpClient
          .post<ApiResponse<ProjectResDto>>(
            this.configService.endpoint('/projects'),
            newProject,
          )
          .pipe(
            switchMap((res) => {
              this._project.next(res.data);
              if (!projects || !(projects instanceof Array)) {
                projects = [];
              }
              projects.push(res.data);
              this._projects.next(projects);
              return of(res);
            }),
          );
      }),
    );
  }
  all(): Observable<ApiResponse<ProjectResDto[]>> {
    return this.httpClient
      .get<ApiResponse<ProjectResDto[]>>(
        this.configService.endpoint(`/projects`),
      )
      .pipe(
        switchMap((response: ApiResponse<ProjectResDto[]>) => {
          this._projects.next(response.data);
          return of(response);
        }),
      );
  }
  select(project: ProjectResDto) {
    this._project.next(project);
  }
}
