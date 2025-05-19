import { ChangeDetectionStrategy, Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ArkDrawer,
  ArkDrawerContainer,
  ArkDrawerContent,
  ArkTextInput,
  BaseListComponent,
  CapitalizePipe,
} from 'arkhamcity';
import { SchemaResDto } from '@modules/private/project/firestore/schema/schema.types';
import { SchemaService } from '@modules/private/project/firestore/schema/schema.service';
import { takeUntil } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ArkButton,
} from '../../../../../../../projects/arkhamcity/src/lib/components/buttons/ark-button/ark-button.component';


@Component({
  selector: 'project-firestore-schema-list',
  imports: [CommonModule, RouterModule, ArkDrawerContainer, ArkDrawer, ArkDrawerContent, ArkTextInput, TranslocoPipe, CapitalizePipe, ArkButton],
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseListComponent {
  @ViewChild('drawer') drawer!: ArkDrawer;
  schemas: SchemaResDto[] = [];
  private readonly schemaService = inject(SchemaService);

  override ngOnInit() {
    this.schemaService.schemas$.pipe(takeUntil(this.unsubscrubeAll)).subscribe(schemas => {
      this.schemas = schemas;
      this.changeDetectorRef.markForCheck();
    });
  }
}
