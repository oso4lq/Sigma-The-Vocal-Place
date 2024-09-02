import { Component } from '@angular/core';
import { Card } from '../about/about.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { Navigation, Pagination } from 'swiper/modules';

export interface Review extends Card {
  user: string;
  source: Source;
  rating: number;
}

interface Source {
  id: number;
  name: string;
  logo: string;
}

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [
    CommonModule,
    GalleryComponent,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.scss'
})
export class FeedbacksComponent {

  // Define reviews data as an array of Source objects
  sources: Source[] = [
    {
      id: 0,
      name: 'Avito',
      logo: '',
    },
    {
      id: 1,
      name: 'Google',
      logo: '',
    },
    {
      id: 2,
      name: 'Yandex',
      logo: '',
    },
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
      source: this.sources[0],
      rating: 5,
    },
    {
      id: 1,
      title: 'Эффективное обучение вокалу: результаты заметны уже после нескольких занятий!',
      image: '',
      contentShort: '',
      contentLong: 'Я начал заниматься вокалом в этой школе около месяца назад и уже вижу значительные улучшения! Преподаватели обладают огромным опытом и знают, как помочь каждому ученику. Они уделяют внимание не только технике пения, но и развитию музыкального слуха, ритма и эмоциональной выразительности. Занятия проходят интересно и динамично, а комфортная атмосфера позволяет расслабиться и сосредоточиться на обучении. Рекомендую эту школу всем, кто хочет научиться петь красиво и уверенно!',
      user: 'Иван Иванов',
      source: this.sources[2],
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Вокальная школа мечты: развитие голоса и уверенность в себе!',
      image: '',
      contentShort: '',
      contentLong: 'Я посещаю эту школу уже несколько месяцев и не могу не радоваться достигнутым результатам! Преподаватели здесь настоящие профессионалы своего дела, они помогают мне раскрыть свой потенциал и научиться петь красиво и уверенно. Занятия проходят регулярно, а разнообразие методик и подходов позволяет мне развиваться гармонично. Атмосфера на уроках тёплая и дружеская, что способствует быстрому усвоению материала. Рекомендую эту школу всем, кто хочет научиться петь и обрести уверенность в себе!',
      user: 'Светлана Сидорова',
      source: this.sources[1],
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Вокальная школа — путь к успеху: прогресс заметен с каждым занятием!',
      image: '',
      contentShort: '',
      contentLong: 'Я занимаюсь в этой школе уже несколько месяцев и не перестаю удивляться прогрессу! Преподаватели здесь настоящие мастера своего дела, они помогают мне улучшить технику пения, расширить диапазон и развить музыкальный слух. Занятия проходят интересно и динамично, а комфортная атмосфера позволяет сосредоточиться на обучении. Рекомендую эту школу всем, кто хочет научиться петь красиво и стать успешным вокалистом!',
      user: 'Олег Михайлович',
      source: this.sources[2],
      rating: 5,
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

  swiperVerticalConfig: SwiperOptions = {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 20,
    freeMode: true,
    grabCursor: true,
    loop: true,
    centeredSlides: false,
    resistanceRatio: 0.5,
  };

  // ngAfterViewInit() {
  //   Swiper.use([Navigation, Pagination]);
  //   const swiperInstance = new Swiper('.vertical-swiper', this.swiperConfigVertical);
  // }

  ngAfterViewInit() {
    const swiperVertical = new Swiper('.vertical-swiper', this.swiperVerticalConfig);

    swiperVertical.on('slideChange', () => {
      console.log('Slide changed swiperVertical');
    });
  }
}
