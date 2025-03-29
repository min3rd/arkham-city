import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';
import { NewProjectReqDto, ProjectResDto } from './project.type';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../core/services/config.service';
import { Response } from '../../../core/type/response.type';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private _projects: BehaviorSubject<ProjectResDto[]> =
    new BehaviorSubject<any>(null);
  private _project: BehaviorSubject<ProjectResDto> = new BehaviorSubject<any>(
    null
  );
  private httpClient: HttpClient = inject(HttpClient);
  private configService: ConfigService = inject(ConfigService);
  constructor() {}
  create(newProject: NewProjectReqDto) {
    return this._projects.pipe(
      take(1),
      switchMap((projects) => {
        return this.httpClient
          .post<Response<ProjectResDto>>(
            this.configService.endpoint('/projects/new-project'),
            newProject
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
            })
          );
      })
    );
  }
}
