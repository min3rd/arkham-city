import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'project-firestore-schema',
  imports: [RouterModule],
  templateUrl: './schema.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class SchemaComponent {

}
