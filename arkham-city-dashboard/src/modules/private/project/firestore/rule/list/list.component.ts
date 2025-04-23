import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { BaseListComponent } from '../../../../../../core/components/base/base-list/base-list.component';
import { RuleService } from '../rule.service';
import { takeUntil } from 'rxjs';
import { GetAllRuleResDto } from '../rule.types';
import { ArkBadge } from '../../../../../../core/components/badges/ark-badge/ark-badge.component';

@Component({
  selector: 'projects-firestore-rules-list',
  imports: [CommonModule, RouterModule, TranslocoModule, ArkBadge],
  templateUrl: './list.component.html',
})
export class ListComponent extends BaseListComponent {
  rules!: GetAllRuleResDto[] | null;
  private rulteService = inject(RuleService);

  override ngOnInit() {
    super.ngOnInit();
    this.rulteService.rules$.pipe(takeUntil(this.unsubscrubeAll)).subscribe(rules => {
      this.rules = rules;
      this.changeDetectorRef.detectChanges();
    });
  }

}
