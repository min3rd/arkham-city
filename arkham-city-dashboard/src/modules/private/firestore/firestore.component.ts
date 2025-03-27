import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-firestore',
  imports: [],
  templateUrl: './firestore.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirestoreComponent implements OnInit {

  ngOnInit(): void { }

}
