import { Component, computed, OnInit, Signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MainSections, ScrollingService } from './services/scrolling.service';
import { filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UserData } from './interfaces/data.interface';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'sigma-vocal-place';

  constructor(
    private scrollingService: ScrollingService,
    private authService: AuthService,
    private router: Router,
  ) { }

  // Computed signals to track the current user
  currentUser: Signal<User | null | undefined> = computed(() => this.authService.currentUserSig());
  currentUserData: Signal<UserData | null> = computed(() => this.authService.currentUserDataSig());

  ngOnInit() {
    // Subscribe to router events to detect route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const urlWithoutParams = event.url.split('?')[0];

        console.log('currentUser', this.currentUser());
        console.log('currentUserData', this.currentUserData());

        if (urlWithoutParams !== '/') {
          // Disable jump-scrolling and reset header and buttons classes when outside the main page
          this.scrollingService.setMainPage(false);
          this.scrollingService.removeAllButtonHighlights();
          this.scrollingService.resetHeaderTransparency();
        }

        if (urlWithoutParams === '/') {
          // Re-enable jump-scrolling and scroll to the correct section
          this.scrollingService.setMainPage(true);
          setTimeout(() => {
            this.scrollingService.checkCurrentSection();
            this.scrollingService.handleHeaderTransparency();
          }, 10);
        }
      });
  }

  // Navigate to the section from anywhere in the app
  navigateToSection(section?: MainSections) {
    const targetSection = section || MainSections.Home;

    if (!this.scrollingService.isMainPage) {
      this.router.navigate(['/']).then(() => {
        this.scrollingService.scrollToSection(targetSection);
      });
    } else {
      this.scrollingService.scrollToSection(targetSection);
    }
  }

}
