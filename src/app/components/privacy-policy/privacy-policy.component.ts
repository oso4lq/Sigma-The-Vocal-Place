import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

  constructor(
    private parent: AppComponent,
  ) { }

  navigateToSection() {
    this.parent.navigateToSection();
  }

}
