import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from '../../app.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private parent: AppComponent,
  ) { }

  openForm() {
    this.parent.openForm();
  }
  
}
