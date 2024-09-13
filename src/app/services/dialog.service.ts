import { Injectable } from '@angular/core';
import { ScrollingService } from './scrolling.service';
import { MatDialog } from '@angular/material/dialog';
import { Card } from '../interfaces/data.interface';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { NewClassFormComponent } from '../components/new-class-form/new-class-form.component';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  isDialogOpen = false;

  constructor(
    private scrollingService: ScrollingService,
    private dialog: MatDialog,
  ) { }

  initiateDialog() {
    this.isDialogOpen = true;
    // Disable scrolling and opening menu when the image viewer is opened
    this.scrollingService.restrictBodyScrolling();
    // Push fake state to close the popup with the back button
    history.pushState(null, '', window.location.href);
  }

  // Enable scrolling and opening menu when the image viewer is closed
  killDialog() {
    this.isDialogOpen = false;
    this.scrollingService.enableBodyScrolling();
  }

  // Image Viewer
  openImage(images: Card[], initialSlide: number) {
    this.initiateDialog();

    const dialogRef = this.dialog.open(GalleryComponent, {
      data: { slides: images, initialSlide: initialSlide },
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'image-viewer-dialog',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.killDialog();
    });
  }

  // New Class Form
  openForm() {
    this.initiateDialog();

    const dialogRef = this.dialog.open(NewClassFormComponent, {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'new-class-form-dialog',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.killDialog();
    });
  }

  // Login Form
  openLogin() {
    this.initiateDialog();

    const dialogRef = this.dialog.open(LoginComponent, {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'new-class-form-dialog',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.killDialog();
    });
  }
}
