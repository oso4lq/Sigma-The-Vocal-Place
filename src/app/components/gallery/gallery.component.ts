import { Component, Input } from '@angular/core';
import { Card } from '../about/about.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { MobileService } from '../../services/mobile.service';

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
    // new Swiper('.swiper-container', this.swiperConfig);
    const swiperInstance = new Swiper('.swiper-container', this.swiperConfig);

    // Disable swipe tracking when interacting with the gallery
    swiperInstance.on('touchStart', () => {
      this.mobileService.disableSwipeTracking();
    });

    // Re-enable swipe tracking when interaction ends
    swiperInstance.on('touchEnd', () => {
      // this.mobileService.enableSwipeTracking();
      setTimeout(() => this.mobileService.enableSwipeTracking(), 500);
    });
  }

  ngOnDestroy() {
    this.mobileService.enableSwipeTracking();
  }
}