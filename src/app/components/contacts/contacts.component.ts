import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MapyczComponent } from '../mapycz/mapycz.component';
import { SocialMediaComponent } from '../social-media/social-media.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    SocialMediaComponent,
    MapyczComponent,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {

}
