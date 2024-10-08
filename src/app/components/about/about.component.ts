import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GalleryComponent } from '../gallery/gallery.component';
import { MobileService } from '../../services/mobile.service';
import { Card } from '../../interfaces/data.interface';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    GalleryComponent,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {

  selectedCardId: number = 1;
  isMobile: boolean = false;

  // Define card data as an array of Card objects
  cards: Card[] = [
    {
      id: 0,
      title: 'Преподаватель',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/cat_S_sing3_png.jpg?ver=0',
      contentShort: 'Я, [Tutors Name], преподаватель вокала.',
      contentLong: 'Я, [Tutors Name], имею за плечами более 5 лет опыта преподавания вокала. Имею высшее музыкальное образование. Окончила кафедру эстрадно-джазового вокала факультета музыкального искусства эстрады СПбГИК.'
    },
    {
      id: 1,
      title: 'Студия',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/studio2_png.jpg?ver=0',
      contentShort: 'ΣΙΓΜΑ – пространство для творчества.',
      contentLong: 'Студия ΣΙΓΜΑ расположена в Московском районе Санкт-Петербурга. Это творческое пространство с уютной атмосферой, оснащённое необходимым оборудованием. Здесь вы сможете эффективно развивать свои навыки и способности.'
    },
    {
      id: 2,
      title: 'Занятия',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/lesson1_png.jpg?ver=0',
      contentShort: 'Занятия для всех уровней.',
      contentLong: 'Независимо от того, начинаете ли вы или хотите усовершенствовать свою технику, в ΣΙΓΜΑ вы найдёте программу для себя. Я работаю с учениками любого уровня от начинающих до профессиональных певцов.'
    },
  ];

  // Swiper About settings
  swiperAboutConfig: SwiperOptions = {
    slidesPerView: 1.1,
    centeredSlides: true,
    spaceBetween: 4,
    initialSlide: 1,
    slideToClickedSlide: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  constructor(
    private mobileService: MobileService,
  ) { }

  ngOnInit() {
    this.isMobile = this.mobileService.isMobile;
  }
  
  ngAfterViewInit() {
    Swiper.use([Navigation, Pagination]);
    const swiperAbout = new Swiper('.swiper-about', this.swiperAboutConfig);

    // Disable swipe tracking when interacting with the gallery
    swiperAbout.on('touchStart', () => {
      this.mobileService.disableSwipeTracking();
    });

    // Re-enable swipe tracking when interaction ends
    swiperAbout.on('touchEnd', () => {
      setTimeout(() => this.mobileService.enableSwipeTracking(), 500);
    });
  }

  ngOnDestroy() {
    this.mobileService.enableSwipeTracking();
  }

  nextImage(event: Event) {
    event.stopPropagation();
    const nextId = this.selectedCardId + 1;
    if (nextId < this.cards.length) {
      this.selectedCardId = nextId;
    }
  }

  prevImage(event: Event) {
    event.stopPropagation();
    const prevId = this.selectedCardId - 1;
    if (prevId >= 0) {
      this.selectedCardId = prevId;
    }
  }

  selectCard(cardId: number) {
    this.selectedCardId = cardId;
  }
}
