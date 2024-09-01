import { Component } from '@angular/core';
import { Card } from '../about/about.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GalleryComponent } from '../gallery/gallery.component';
import Swiper from 'swiper';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [
    CommonModule,
    GalleryComponent,
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.scss'
})
export class StudioComponent {

  // Define images data as an array of Card objects
  cards: Card[] = [
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

  constructor(private dialog: MatDialog) { }

  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      slidesPerView: 1.1,
      spaceBetween: 20,
      freeMode: true,
      grabCursor: true,
      loop: false,
      centeredSlides: true,
      resistanceRatio: 0.5,
    });
  }

  openGallery(index: number) {
    this.dialog.open(GalleryComponent, {
      data: { slides: this.cards, initialSlide: index }
    });
  }
}
