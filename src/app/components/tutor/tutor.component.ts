import { Component } from '@angular/core';
import { Card } from '../../interfaces/data.interface';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-tutor',
  standalone: true,
  imports: [],
  templateUrl: './tutor.component.html',
  styleUrl: './tutor.component.scss'
})
export class TutorComponent {

  // Defined two arrays with images to open them separately
  diplomaImg: Card[] = [
    {
      id: 0,
      title: 'Диплом',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/diploma_tk8dre.png',
      contentShort: '',
      contentLong: '',
    },
  ]

  tutorInAction: Card[] = [
    {
      id: 0,
      title: 'Занятие с учеником',
      image: 'https://res.cloudinary.com/dxunxtt1u/image/upload/lesson3_yvbe9q.png',
      contentShort: '',
      contentLong: '',
    },
  ]

  constructor(
    private dialogService: DialogService,
  ) { }

  openGallery(array: Card[], index: number) {
    this.dialogService.openImage(array, index);
  }
}
