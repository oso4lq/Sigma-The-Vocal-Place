import { Component } from '@angular/core';
import { Card } from '../about/about.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GalleryComponent } from '../gallery/gallery.component';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import { FeedbacksComponent } from '../feedbacks/feedbacks.component';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [
    CommonModule,
    GalleryComponent,
    FeedbacksComponent,
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.scss'
})
export class StudioComponent {

  // Define images data as an array of Card objects
  images: Card[] = [
    {
      id: 0,
      title: 'studio 2',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/studio2_bqt3o4.png',
      contentShort: '',
      contentLong: '',
    },
    {
      id: 1,
      title: 'lesson 1',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/lesson1_lsfjiy.png',
      contentShort: '',
      contentLong: '',
    },
    {
      id: 2,
      title: 'lesson 3',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/lesson3_yvbe9q.png',
      contentShort: '',
      contentLong: '',
    },
    {
      id: 3,
      title: 'cat on the ledge M',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/catav1_xtbtoq.png',
      contentShort: '',
      contentLong: '',
    },
    {
      id: 4,
      title: 'cat on the ledge F',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/catav4_eee4hv.png',
      contentShort: '',
      contentLong: '',
    },
    {
      id: 5,
      title: 'cat chimney M',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/catav2_dhihzp.png',
      contentShort: '',
      contentLong: '',
    },
    {
      id: 6,
      title: 'cat chimney F',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/catav3_k54mfm.png',
      contentShort: '',
      contentLong: '',
    },
  ]

  constructor(
    private dialog: MatDialog,
  ) { }

  ngAfterViewInit() {
    const swiper = new Swiper('.swiper-container', {
      modules: [Autoplay],  // Add this line to include the Autoplay module
      slidesPerView: 3,  // Number of slides visible at the same time in the viewport
      spaceBetween: 20,  // Space (in px) between each slide
      freeMode: true,  // Enables free scrolling without snapping to slides
      grabCursor: true,  // Changes the cursor to a grab icon when hovering over the Swiper
      loop: true,  // Enables infinite looping of slides
      centeredSlides: false,  // Disables centering of slides; they align to the left
      resistanceRatio: 0.5,  // Controls the resistance ratio during swiping to avoid dragging too far
      speed: 1000,  // Increase speed for a smoother transition
      autoplay: {
        delay: 2000,  // Time delay (in ms) between automatic slide transitions
        disableOnInteraction: true,  // Autoplay will not be disabled after user interactions (e.g., swiping)
      },
    });

    swiper.on('slideChange', () => {
      console.log('Slide changed');
    });
  }

  openGallery(index: number) {
    console.log('clicked image number ', index);
    // this.dialog.open(GalleryComponent, {
    //   data: { slides: this.images, initialSlide: index },
    //   width: '80%',
    //   height: '80%',
    // });
  }
}
