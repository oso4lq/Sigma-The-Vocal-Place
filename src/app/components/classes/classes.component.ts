import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Card } from '../../interfaces/data.interface';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent {

  cards: Card[] = [
    {
      id: 0,
      title: 'Вокал для всех',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/icon_mike-852_hdnnjm.png',
      contentShort: '',
      contentLong: 'Занятия построены на моей авторской эффективной методике, лёгкой для восприятия и позволяющей быстро достичь результатов. Уже на первом уроке вы научитесь соединять голос и тело и услышите новые краски и возможности в своём голосе. Мои занятия подходят ученикам любого уровня подготовки.'
    },
    {
      id: 1,
      title: 'Индивидуальный план обучения',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/icon_note-649_jbru3t.png',
      contentShort: '',
      contentLong: 'На первой встрече мы проведём диагностику вашего голоса и вместе разработаем эффективный план работы. После мы подберём для вас песни, которые выгодно подчеркнут ваш голос и помогут освоить новые техники. Вы можете выбрать песню на свой вкус или предложить свой вариант.'
    },
    {
      id: 2,
      title: 'Осуществите свою мечту',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/icon_star-824_enfepp.png',
      contentShort: '',
      contentLong: 'Начав заниматься вокалом, вы сможете исполнить любимую песню, развить свой уникальный стиль и звучание, научиться выступать перед аудиторией. Это уникальная возможность проявить творческие способности, преодолеть страх сцены и развить уверенность в себе.'
    },
    {
      id: 3,
      title: 'Раскройте себя',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/icon_sing3_mywdng.png',
      contentShort: '',
      contentLong: 'Уроки вокала помогут вам раскрыть свой потенциал, обрести уверенность и получать удовольствие от процесса. Вы научитесь правильному дыханию, разовьёте свой музыкальный слух, устраните телесные зажимы. Поставив голос, вы будете звучать естественно и наслаждаться своим природным тембром.'
    }
  ];

  constructor(
    private dialogService: DialogService,
  ) { }

  openForm() {
    this.dialogService.openForm();
  }

}