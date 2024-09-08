import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ClassesComponent } from '../classes/classes.component';
import { TutorComponent } from '../tutor/tutor.component';
import { StudioComponent } from '../studio/studio.component';
import { ContactsComponent } from '../contacts/contacts.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HomeComponent,
    AboutComponent,
    ClassesComponent,
    TutorComponent,
    StudioComponent,
    ContactsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
