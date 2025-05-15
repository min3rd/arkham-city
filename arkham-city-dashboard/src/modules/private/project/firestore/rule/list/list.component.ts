import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  BaseListComponent,
} from '../../../../../../../projects/arkhamcity/src/lib/components/base/base-list/base-list.component';
import { RuleService } from '../rule.service';
import { takeUntil } from 'rxjs';
import { SchemaRuleResDto } from '../rule.types';
import {
  ArkBadge,
} from '../../../../../../../projects/arkhamcity/src/lib/components/badges/ark-badge/ark-badge.component';

@Component({
  selector: 'project-firestore-rule-list',
  imports: [CommonModule, RouterModule, TranslocoModule, ArkBadge],
  templateUrl: './list.component.html',
})
export class ListComponent extends BaseListComponent implements OnInit {
  rules!: SchemaRuleResDto[] | null;
  private rulteService = inject(RuleService);

  override ngOnInit() {
    super.ngOnInit();
    this.rulteService.rules$.pipe(takeUntil(this.unsubscrubeAll)).subscribe(rules => {
      this.rules = rules;
      this.changeDetectorRef.detectChanges();
    });
  }

}
