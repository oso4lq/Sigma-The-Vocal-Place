import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Class, TimelineSlot } from '../../interfaces/data.interface';
import { Moment } from 'moment';
import moment from 'moment/moment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit, OnChanges {

  @Input() classes: Class[] = [];
  @Input() selectedDate: Moment = moment();
  @Output() slotClicked = new EventEmitter<TimelineSlot>();

  timeSlots: TimelineSlot[] = [];

  ngOnInit() {
    this.generateTimeline();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classes'] || changes['selectedDate']) {
      console.log('changed', changes['classes'], 'or', changes['selectedDate']);
      this.generateTimeline();
    }
  }

  // Generate time slots for the selected date based on the received classes[]
  private generateTimeline() {
    console.log('generating timeline with ', this.classes, this.selectedDate);
    this.timeSlots = this.createTimeSlots(this.classes, this.selectedDate);
  }

  // Create separate time slots
  private createTimeSlots(classes: Class[], date: Moment): TimelineSlot[] {
    const dayStart = date.clone().hour(8).minute(0).second(0);
    const dayEnd = date.clone().hour(20).minute(0).second(0);
    const slots: TimelineSlot[] = [];

    // Create a map of occupied times
    const occupiedTimes: { [key: string]: boolean } = {};
    classes.forEach(cls => {
      const clsStartTime = moment(cls.startdate);
      const clsEndTime = moment(cls.enddate);
      let time = clsStartTime.clone();

      while (time.isBefore(clsEndTime)) {
        occupiedTimes[time.format('HH:mm')] = true;
        time.add(1, 'hour');
      }
    });

    // Generate 1-hour slots
    let currentTime = dayStart.clone();
    while (currentTime.isBefore(dayEnd)) {
      const slotEndTime = currentTime.clone().add(1, 'hour');
      const slotKey = currentTime.format('HH:mm');
      const status = occupiedTimes[slotKey] ? 'occupied' : 'free';

      slots.push({
        startTime: currentTime.clone(),
        endTime: slotEndTime.clone(),
        status,
      });

      currentTime = slotEndTime;
    }

    return slots;
  }

  onSlotClicked(timeSlot: TimelineSlot) {
    console.log('timeSlot clicked', timeSlot);
    this.slotClicked.emit(timeSlot);
  }
}