import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ScrollingService } from './services/scrolling.service';
import { MatDialog } from '@angular/material/dialog';
import { Card } from './interfaces/data.interface';
import { GalleryComponent } from './components/gallery/gallery.component';
import { NewClassFormComponent } from './components/new-class-form/new-class-form.component';

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
  isImageViewerOpen = false;

  constructor(
    private scrollingService: ScrollingService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // Check section on app load
    this.scrollingService.checkCurrentSection();
    // Make header semi-transparent on the home section
    this.scrollingService.handleHeaderTransparency();

    // Subscribe to router events to detect route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        const urlWithoutParams = event.url.split('?')[0]; // Remove query params for the comparison
        const queryParams = this.route.snapshot.queryParams; // Get query params
        const section = queryParams['section']; // Get the section parameter

        if (urlWithoutParams === '/privacy-policy') {

          // console.log('Navigated to privacy policy');
          // Scroll to the top of the page ?
          // setTimeout(() => {
          //   window.scrollTo(0, 0);
          // }, 100);

          // Disable jump-scrolling and reset header and buttons classes when outside the main page
          this.scrollingService.setMainPage(false);
          this.scrollingService.removeAllButtonHighlights();
          this.scrollingService.resetHeaderTransparency();
        }

        if (urlWithoutParams === '/') {
          // console.log('Navigated to main page');
          // Re-enable jump-scrolling and re-check the current section and transparency when returning to main
          this.scrollingService.setMainPage(true);

          this.scrollingService.checkCurrentSection();

          // If there's a section in the query params, scroll to it
          // if (section) {
          //   const element = document.getElementById(section);
          //   if (element) {
          //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          //   }
          // } else {
          //   this.scrollingService.checkCurrentSection();
          // }

          this.scrollingService.handleHeaderTransparency();
        }
      }
    });
  }

  // Image Viewer
  openImage(images: Card[], initialSlide: number) {
    // Disable scrolling and opening menu when the image viewer is opened
    this.scrollingService.restrictBodyScrolling();
    this.isImageViewerOpen = true;

    const dialogRef = this.dialog.open(GalleryComponent, {
      data: { slides: images, initialSlide: initialSlide },
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'image-viewer-dialog',
      disableClose: false,
    });

    // Enable scrolling and opening menu when the image viewer is closed
    dialogRef.afterClosed().subscribe(() => {
      this.isImageViewerOpen = false;
      this.scrollingService.enableBodyScrolling();
    });
  }

  openForm() {
    this.scrollingService.restrictBodyScrolling();
    this.isImageViewerOpen = true;

    const dialogRef = this.dialog.open(NewClassFormComponent, {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'new-class-form-dialog',
      disableClose: false,
    });

    // Enable scrolling and opening menu when the image viewer is closed
    dialogRef.afterClosed().subscribe(() => {
      this.isImageViewerOpen = false;
      this.scrollingService.enableBodyScrolling();
    });
  }

}
