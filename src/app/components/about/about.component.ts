import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  selectedCardIndex: number = 1;

  // Define card data as an array of Card objects
  cards: Card[] = [
    {
      title: 'Обо мне',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/cat_S_sing3_png.jpg?ver=0',
      contentShort: 'Я, [Tutors Name], преподаватель вокала.',
      contentLong: 'Я, [Tutors Name], имею за плечами более 5 лет опыта преподавания вокала. Имею высшее музыкальное образование. Окончила кафедру эстрадно-джазового вокала факультета музыкального искусства эстрады СПбГИК.'
    },
    {
      title: 'О студии',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/studio2_png.jpg?ver=0',
      contentShort: 'ΣΙΓΜΑ – пространство для творчества.',
      contentLong: 'Студия ΣΙΓΜΑ расположена в Московском районе Санкт-Петербурга. Это творческое пространство с уютной атмосферой, оснащённое необходимым оборудованием. Здесь вы сможете эффективно развивать свои навыки и способности.'
    },
    {
      title: 'Занятия',
      image: 'https://img42.rajce.idnes.cz/d4202/19/19234/19234587_7120b7f029e3a19a3efd09788a59d31b/images/lesson1_png.jpg?ver=0',
      contentShort: 'Занятия для всех уровней.',
      contentLong: 'Независимо от того, начинаете ли вы или хотите усовершенствовать свою технику, в ΣΙΓΜΑ вы найдёте программу для себя. Я работаю с учениками любого уровня от начинающих до профессиональных певцов.'
    },
  ];

  constructor() { }

  ngOnInit() { }

  nextImage(event: Event) {
    event.stopPropagation();
    if (this.selectedCardIndex < this.cards.length - 1) {
      this.selectedCardIndex++;
    }
  }

  prevImage(event: Event) {
    event.stopPropagation();
    if (this.selectedCardIndex > 0) {
      this.selectedCardIndex--;
    }
  }

  selectCard(index: number) {
    this.selectedCardIndex = index;
  }
}
