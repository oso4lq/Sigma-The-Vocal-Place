import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ClassesComponent } from './components/classes/classes.component';
import { ScrollingService } from './services/scrolling.service';
import { StudioComponent } from './components/studio/studio.component';
import { TutorComponent } from './components/tutor/tutor.component';
import { MatDialog } from '@angular/material/dialog';
import { Card } from './interfaces/data.interface';
import { GalleryComponent } from './components/gallery/gallery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    ClassesComponent,
    TutorComponent,
    StudioComponent,
    ContactsComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'sigma-vocal-place';

  constructor(
    private dialog: MatDialog,
    private scrollingService: ScrollingService,
  ) { }

  ngOnInit() {
    // Check section on app load
    this.scrollingService.checkCurrentSection();
    // Make header semi-transparent on the home section
    this.scrollingService.handleHeaderTransparency();
  }

  openImage(images: Card[], initialSlide: number) {
    this.dialog.open(GalleryComponent, {
      data: { slides: images, initialSlide: initialSlide },
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'image-viewer-dialog',
      disableClose: false,
    });
  }

}
