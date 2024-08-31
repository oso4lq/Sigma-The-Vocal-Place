import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SocialMediaComponent } from '../social-media/social-media.component';
import { ScrollingService } from '../../services/scrolling.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MobileService } from '../../services/mobile.service';

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
export class HeaderComponent implements OnInit {

  isMenuOpen = false;

  constructor(
    private scrollingService: ScrollingService,
    private mobileService: MobileService,
  ) { }

  ngOnInit() {
    // this.scrollingService.checkCurrentSection();

    if (this.mobileService.isMobile) {
      this.mobileService.swipeRight$.subscribe(() => {
        if (!this.isMenuOpen) this.toggleMenu();
      });

      this.mobileService.swipeLeft$.subscribe(() => {
        if (this.isMenuOpen) this.toggleMenu();
      });
    }
  }

  scrollToSection(id: string) {
    this.scrollingService.scrollToSection(id);
    this.isMenuOpen = false; // Close menu after selection
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    // Apply the highlighted class immediately
    setTimeout(() => {
      this.scrollingService.checkCurrentSection();
    }, 10);
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
