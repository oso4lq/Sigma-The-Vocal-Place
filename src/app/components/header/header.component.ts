import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SocialMediaComponent } from '../social-media/social-media.component';
import { ScrollingService } from '../../services/scrolling.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    SocialMediaComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isMenuOpen = false;

  constructor(
    private scrollingService: ScrollingService,
  ) { }

  scrollToSection(id: string) {
    this.scrollingService.scrollToSection(id);
    this.isMenuOpen = false; // Close menu after selection
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}