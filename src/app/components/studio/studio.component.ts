import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from '../gallery/gallery.component';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MobileService } from '../../services/mobile.service';
import { Card, Review, Source } from '../../interfaces/data.interface';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [
    CommonModule,
    GalleryComponent,
    MatDividerModule,
    MatIconModule,
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
      title: 'cat in front of the chimney M',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/catav2_dhihzp.png',
      contentShort: '',
      contentLong: '',
    },
    {
      id: 6,
      title: 'cat in front of the chimney F',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/catav3_k54mfm.png',
      contentShort: '',
      contentLong: '',
    },
  ]

  // Define reviews data as an array of Source objects
  sources: Source[] = [
    {
      id: 0,
      name: 'Avito',
      logo: 'https://res.cloudinary.com/dxunxtt1u/image/upload/avito-icon_p6m35u.png',
    },
    {
      id: 1,
      name: 'Google',
      logo: 'https://res.cloudinary.com/dxunxtt1u/image/upload/google-icon_aroyzl.png',
    },
    {
      id: 2,
      name: 'Yandex',
      logo: 'https://res.cloudinary.com/dxunxtt1u/image/upload/yandex-icon_czbcw1.png',
    },
    {
      id: 3,
      name: 'Profi',
      logo: 'https://res.cloudinary.com/dxunxtt1u/image/upload/Profi_logo_qqm8zp.png',
    }
  ]

  // Define reviews data as an array of Review objects
  reviews: Review[] = [
    {
      id: 0,
      title: 'Потрясающая вокальная школа: мой прогресс невероятен!',
      image: '',
      contentShort: '',
      contentLong: 'Я посещаю эту замечательную вокальную школу уже несколько месяцев и не могу не поделиться своим восторгом! Уровень преподавания здесь просто потрясающий, а индивидуальный подход к каждому ученику позволяет мне развиваться максимально быстро. Благодаря опытным педагогам, я смогла значительно улучшить свои вокальные навыки и расширить диапазон. Атмосфера на занятиях всегда позитивная и дружелюбная, что способствует комфортному обучению. Рекомендую эту школу всем, кто хочет научиться петь и раскрыть свой потенциал!',
      user: 'Мария Петрова',
      source: this.sources[3],
      rating: 5,
    },
    {
      id: 1,
      title: 'Вокальная школа — путь к успеху: прогресс заметен с каждым занятием!',
      image: '',
      contentShort: '',
      contentLong: 'Я занимаюсь в этой школе уже несколько месяцев и не перестаю удивляться прогрессу! Преподаватели здесь настоящие мастера своего дела, они помогают мне улучшить технику пения, расширить диапазон и развить музыкальный слух. Занятия проходят интересно и динамично, а комфортная атмосфера позволяет сосредоточиться на обучении. Рекомендую эту школу всем, кто хочет научиться петь красиво и стать успешным вокалистом!',
      user: 'Олег Михайлович',
      source: this.sources[0],
      rating: 5,
    },
    {
      id: 2,
      title: 'Эффективное обучение вокалу: результаты заметны уже после нескольких занятий!',
      image: '',
      contentShort: '',
      contentLong: 'Я начал заниматься вокалом в этой школе около месяца назад и уже вижу значительные улучшения! Преподаватели обладают огромным опытом и знают, как помочь каждому ученику. Они уделяют внимание не только технике пения, но и развитию музыкального слуха, ритма и эмоциональной выразительности. Занятия проходят интересно и динамично, а комфортная атмосфера позволяет расслабиться и сосредоточиться на обучении. Рекомендую эту школу всем, кто хочет научиться петь красиво и уверенно!',
      user: 'Иван Иванов',
      source: this.sources[1],
      rating: 4.8,
    },
    {
      id: 3,
      title: 'Вокальная школа мечты: развитие голоса и уверенность в себе!',
      image: '',
      contentShort: '',
      contentLong: 'Я посещаю эту школу уже несколько месяцев и не могу не радоваться достигнутым результатам! Преподаватели здесь настоящие профессионалы своего дела, они помогают мне раскрыть свой потенциал и научиться петь красиво и уверенно. Занятия проходят регулярно, а разнообразие методик и подходов позволяет мне развиваться гармонично. Атмосфера на уроках тёплая и дружеская, что способствует быстрому усвоению материала. Рекомендую эту школу всем, кто хочет научиться петь и обрести уверенность в себе!',
      user: 'Светлана Сидорова',
      source: this.sources[2],
      rating: 4.9,
    },
    {
      id: 4,
      title: 'Вокальная школа — открытие своего голоса: результаты потрясающие!',
      image: '',
      contentShort: '',
      contentLong: 'Я посещаю эту школу уже несколько месяцев и не могу не радоваться достигнутым результатам! Преподаватели здесь настоящие профессионалы своего дела, они помогают мне раскрыть свой голос и научиться петь красиво и уверенно. Занятия проходят регулярно, а разнообразие методик и подходов позволяет мне развиваться гармонично. Атмосфера на уроках тёплая и дружеская, что способствует быстрому усвоению материала. Рекомендую эту школу всем, кто хочет научиться петь и обрести уверенность в себе!',
      user: 'Анна Андреева',
      source: this.sources[0],
      rating: 5,
    },
  ]

  // Swiper Thumbnails settings
  swiperThumbsConfig: SwiperOptions = {
    slidesPerView: 'auto',  // Number of slides visible at the same time in the viewport
    spaceBetween: 20,  // Space (in px) between each slide
    freeMode: true,  // Enables free scrolling without snapping to slides
    grabCursor: true,  // Changes the cursor to a grab icon when hovering over the Swiper
    loop: false,  // Enables infinite looping of slides
    centeredSlides: true,  // Disables centering of slides; they align to the left
    initialSlide: 1,  // Start from the second review
    resistanceRatio: 0.5,  // Controls the resistance ratio during swiping to avoid dragging too far
  };

  // Swiper Reviews settings
  swiperReviewsConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 20,
    freeMode: false,
    grabCursor: true,
    loop: false,
    centeredSlides: true,
    initialSlide: 1,
    slideToClickedSlide: true,
    resistanceRatio: 0.5,
  };

  isMobile: boolean = false;

  constructor(
    private mobileService: MobileService,
    private parent: AppComponent,
  ) { }

  ngOnInit() {
    this.isMobile = this.mobileService.isMobile;
  }

  ngAfterViewInit() {
    Swiper.use([Navigation, Pagination]);

    const swiperThumbs = new Swiper('.swiper-thumbs', this.swiperThumbsConfig);
    swiperThumbs.on('slideChange', () => {
    });
    // Disable swipe tracking when interacting with the gallery
    swiperThumbs.on('touchStart', () => {
      this.mobileService.disableSwipeTracking();
    });
    // Re-enable swipe tracking when interaction ends
    swiperThumbs.on('touchEnd', () => {
      setTimeout(() => this.mobileService.enableSwipeTracking(), 500);
    });

    const swiperReviews = new Swiper('.swiper-reviews', this.swiperReviewsConfig);
    swiperReviews.on('slideChange', () => {
    });
    // Disable swipe tracking when interacting with the gallery
    swiperReviews.on('touchStart', () => {
      this.mobileService.disableSwipeTracking();
    });
    // Re-enable swipe tracking when interaction ends
    swiperReviews.on('touchEnd', () => {
      setTimeout(() => this.mobileService.enableSwipeTracking(), 500);
    });
  }

  openGallery(index: number) {
    this.parent.openImage(this.images, index);
  }
}
