import { Component, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { MobileService } from '../../services/mobile.service';
import { Card } from '../../interfaces/data.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

  slides: Card[] = [];
  initialSlide: number = 1;

  // Swiper Gallery settings
  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 4,
    slideToClickedSlide: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true
    // },
  };

  constructor(
    private mobileService: MobileService,
    @Inject(MAT_DIALOG_DATA) public data: { slides: Card[], initialSlide: number },
    private dialogRef: MatDialogRef<GalleryComponent>,
  ) {
    this.slides = data.slides;
    this.initialSlide = data.initialSlide;
  }

  ngAfterViewInit() {
    Swiper.use([Navigation, Pagination]);

    const swiperGallery = new Swiper('.swiper-gallery', {
      ...this.swiperConfig,
      initialSlide: this.initialSlide,
    });

    // Disable swipe tracking when interacting with the gallery
    swiperGallery.on('touchStart', () => {
      this.mobileService.disableSwipeTracking();
    });

    // Re-enable swipe tracking when interaction ends
    swiperGallery.on('touchEnd', () => {
      setTimeout(() => this.mobileService.enableSwipeTracking(), 500);
    });
  }

  ngOnDestroy() {
    this.mobileService.enableSwipeTracking();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}