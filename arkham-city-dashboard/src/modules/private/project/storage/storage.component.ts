import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'project-storage',
  imports: [RouterModule],
  template: `
    <div class="flex flex-auto flex-col w-full h-full">
      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class StorageComponent {}
