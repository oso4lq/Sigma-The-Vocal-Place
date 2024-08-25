import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MapyczComponent } from '../mapycz/mapycz.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    MapyczComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
