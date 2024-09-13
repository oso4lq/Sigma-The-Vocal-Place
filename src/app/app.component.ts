import { Component, computed, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MainSections, ScrollingService } from './services/scrolling.service';
import { MatDialog } from '@angular/material/dialog';
import { Card } from './interfaces/data.interface';
import { GalleryComponent } from './components/gallery/gallery.component';
import { NewClassFormComponent } from './components/new-class-form/new-class-form.component';
import { filter } from 'rxjs';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';

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
  isDialogOpen = false;

  constructor(
    private scrollingService: ScrollingService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  // Computed signal to track the current user
  currentUser: any = computed(() => this.authService.currentUserSig());
  currentUserData: any = computed(() => this.authService.currentUserDataSig());

  ngOnInit() {
    // Subscribe to router events to detect route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlWithoutParams = event.url.split('?')[0];

      console.log('currentUser', this.currentUser());
      console.log('currentUserData', this.currentUserData());

      if (urlWithoutParams === '/user' && !this.currentUser()) {
        // Redirect to login if trying to access user page without authentication
        this.router.navigate(['/']);
        this.openLogin();  // Open login dialog if user is not authenticated
      }

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

  // Image Viewer
  openImage(images: Card[], initialSlide: number) {
    // Disable scrolling and opening menu when the image viewer is opened
    this.scrollingService.restrictBodyScrolling();
    this.isDialogOpen = true;

    // Push fake state to close the popup with the back button
    history.pushState(null, '', window.location.href);

    const dialogRef = this.dialog.open(GalleryComponent, {
      data: { slides: images, initialSlide: initialSlide },
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'image-viewer-dialog',
      disableClose: false,
    });

    // Enable scrolling and opening menu when the image viewer is closed
    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
      this.scrollingService.enableBodyScrolling();
    });
  }

  openForm() {
    this.scrollingService.restrictBodyScrolling();
    this.isDialogOpen = true;

    // Push fake state to close the popup with the back button
    history.pushState(null, '', window.location.href);

    const dialogRef = this.dialog.open(NewClassFormComponent, {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'new-class-form-dialog',
      disableClose: false,
    });

    // Enable scrolling and opening menu when the image viewer is closed
    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
      this.scrollingService.enableBodyScrolling();
    });
  }

  openLogin() {
    this.scrollingService.restrictBodyScrolling();
    this.isDialogOpen = true;

    // Push fake state to close the popup with the back button
    history.pushState(null, '', window.location.href);

    const dialogRef = this.dialog.open(LoginComponent, {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'new-class-form-dialog',
      disableClose: false,
    });

    // Enable scrolling and opening menu when the image viewer is closed
    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
      this.scrollingService.enableBodyScrolling();
    });
  }
}
