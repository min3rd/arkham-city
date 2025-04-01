import type { ResolveFn } from '@angular/router';
import { ProjectService } from './project/project.service';
import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';

export const privateResolver: ResolveFn<any> = () => {
  const projectService: ProjectService = inject(ProjectService);
  return forkJoin([projectService.all()]);
};
