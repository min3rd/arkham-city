import { Injectable } from '@angular/core';
import { NavigationItem } from '../components/navigation/navigation.type';
import { ProjectResDto } from '../../modules/private/project/project.type';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  defaultNavigations: NavigationItem[] = [
    {
      id: 'dashboard',
      title: 'dashboard',
      icon: 'featherHome',
      type: 'basic',
      link: '/dashboard',
    },
    {
      id: 'firestore',
      title: 'firestore',
      icon: 'featherDatabase',
      type: 'basic',
      link: '/projects/projectId/firestore',
    },
    {
      id: 'storage',
      title: 'storage',
      icon: 'featherHardDrive',
      type: 'basic',
    },
    {
      id: 'realtime',
      title: 'realtime',
      icon: 'featherCloud',
      type: 'basic',
    },
    {
      id: 'tracking',
      title: 'tracking',
      icon: 'featherCrosshair',
      type: 'basic',
    },
    {
      id: 'setting',
      title: 'setting',
      icon: 'featherSettings',
      type: 'group',
      children: [
        {
          id: 'general',
          title: 'general',
          type: 'basic',
        },
        {
          id: 'apps',
          title: 'apps',
          type: 'basic',
          link: '/projects/projectId/apps',
        },
      ],
    },
  ];
  navigations(projectId: string): NavigationItem[] {
    return this.defaultNavigations.map((e) => this.compile(projectId, e));
  }
  compile(projectId: string, navigationItem: NavigationItem): NavigationItem {
    const temp = Object.assign({}, navigationItem);
    if (!!temp.link) {
      temp.link = temp.link.replaceAll('projectId', projectId);
    }
    if (temp.children && temp.children.length > 0) {
      temp.children = temp.children.map((e) => this.compile(projectId, e));
    }
    return temp;
  }
}
