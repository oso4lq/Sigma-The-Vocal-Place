import { Component, HostListener, Inject } from '@angular/core';
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
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {

  slides: Card[] = [];
  initialSlide: number = 1;
  swiperGallery!: Swiper;

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
  };

  // Listen for keyboard left/right to switch slides
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.swiperGallery.slideNext();
    } else if (event.key === 'ArrowLeft') {
      this.swiperGallery.slidePrev();
    }
  }

  // Listen for mouse scroll events to switch slides
  @HostListener('window:wheel', ['$event'])
  handleMouseWheelEvent(event: WheelEvent) {
    if (event.deltaY > 0) {
      this.swiperGallery.slideNext();
    } else {
      this.swiperGallery.slidePrev();
    }
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { slides: Card[], initialSlide: number },
    private dialogRef: MatDialogRef<GalleryComponent>,
    private mobileService: MobileService,
  ) {
    this.slides = data.slides;
    this.initialSlide = data.initialSlide;
  }

  ngAfterViewInit() {
    Swiper.use([Navigation, Pagination]);

    this.swiperGallery = new Swiper('.swiper-gallery', {
      ...this.swiperConfig,
      initialSlide: this.initialSlide,
    });

    // Disable swipe tracking when interacting with the gallery
    this.swiperGallery.on('touchStart', () => {
      this.mobileService.disableSwipeTracking();
    });

    // Re-enable swipe tracking when interaction ends
    this.swiperGallery.on('touchEnd', () => {
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