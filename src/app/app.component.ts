import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  ) { }

  ngOnInit() {
    // Check section on app load
    this.scrollingService.checkCurrentSection();
    // Make header semi-transparent on the home section
    this.scrollingService.handleHeaderTransparency();
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
