import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { MobileService } from '../../services/mobile.service';
import { Card } from '../../interfaces/data.interface';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

  @Input() slides: Card[] = [];

  swiperConfig: SwiperOptions = {
    slidesPerView: 1.1, // Show partial slides
    centeredSlides: true, // Center the active slide
    spaceBetween: 4, // Space between the slides
    initialSlide: 1, // Start from slide number
    slideToClickedSlide: true, // Allow clicking on partial slides to navigate

    // Enables next and previous buttons for navigation
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Adds pagination bullets
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
  };

  constructor(
    private mobileService: MobileService,
  ) { }

  ngAfterViewInit() {
    Swiper.use([Navigation, Pagination]);
    const swiperGallery = new Swiper('.swiper-gallery', this.swiperConfig);

    // Disable swipe tracking when interacting with the gallery
    swiperGallery.on('touchStart', () => {
      this.mobileService.disableSwipeTracking();
      console.log('disableSwipeTracking');
    });

    // Re-enable swipe tracking when interaction ends
    swiperGallery.on('touchEnd', () => {
      setTimeout(() => this.mobileService.enableSwipeTracking(), 500);
      console.log('enableSwipeTracking');
    });
  }

  ngOnDestroy() {
    this.mobileService.enableSwipeTracking();
  }
}