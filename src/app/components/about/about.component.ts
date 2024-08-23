import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import EmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';

// Define the interface or type for your card data
interface Card {
  title: string;
  image: string;
  contentShort: string;
  contentLong: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('embla') emblaRef!: ElementRef;
  private emblaCarousel!: EmblaCarouselType;
  selectedCardIndex: number = 0;

  // Define your card data as an array of Card objects
  cards: Card[] = [
    {
      title: 'Обо мне',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/cat_S_sing3_png.jpg?ver=0',
      contentShort: 'Я, [Tutors Name], преподаватель вокала.',
      contentLong: 'Я, [Tutors Name], имею за плечами более 5 лет опыта преподавания вокала with a background in classical and contemporary singing. Имею высшее музыкальное образование. Окончила кафедру эстрадно-джазового вокала факультета музыкального искусства эстрады СПбГИК.'
    },
    {
      title: 'О студии',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/studio2_png.jpg?ver=0',
      contentShort: 'ΣΙΓΜΑ was founded with the mission...',
      contentLong: 'ΣΙΓΜΑ The Vocal Place was founded with the mission to provide top-notch vocal training to singers of all levels. My studio is a welcoming space where students can grow their skills and confidence.'
    },
    {
      title: 'Занятия',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/lesson1_png.jpg?ver=0',
      contentShort: 'Lessons for all levels.',
      contentLong: 'We offer lessons for beginners, intermediates, and advanced singers. Whether you are just starting out or looking to refine your technique, we have a program for you.'
    },
  ];

  ngAfterViewInit() {
    if (this.cards && this.cards.length) { // Check if data is available
      this.emblaCarousel = EmblaCarousel(this.emblaRef.nativeElement, {
        loop: false,
        containScroll: 'trimSnaps'
      } as EmblaOptionsType);

      this.emblaCarousel.on('select', () => {
        this.selectedCardIndex = this.emblaCarousel.selectedScrollSnap();
        this.cdr.detectChanges();
      });
    } else {
      console.error('Card data is missing or empty');
    }
  }

  constructor(
    private cdr: ChangeDetectorRef,
    // private zone: NgZone,
  ) {
  }


  ngOnInit() {
    // this.initEmblaCarousel();
  }

  // ngAfterViewInit() {
  // setTimeout(() => this.initEmblaCarousel());

  // const emblaNode = document.querySelector('.embla') as HTMLElement;
  // this.emblaCarousel = EmblaCarousel(emblaNode, { loop: false });
  // this.emblaCarousel.on('select', this.onSelect.bind(this));
  // }

  ngOnDestroy() {
    this.emblaCarousel?.destroy();
  }

  nextImage() {
    console.log('next');
    this.selectedCardIndex++;
    this.emblaCarousel?.scrollNext();
  }

  prevImage() {
    console.log('prev');
    this.selectedCardIndex--;
    this.emblaCarousel?.scrollPrev();
  }

  onSelect() {
    this.selectedCardIndex = this.emblaCarousel.selectedScrollSnap();
  }

  selectCard(index: number) {
    this.selectedCardIndex = index;
    console.log('selected card', this.selectedCardIndex);
  }


  // private initEmblaCarousel() {
  //   const options: EmblaOptionsType = {
  //     align: 'center',
  //     containScroll: 'trimSnaps',
  //     startIndex: this.selectedCardIndex,
  //   };
  // }
}