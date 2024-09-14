import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

  timeSlots: TimelineSlot[] = [];

  ngOnInit() {
    this.generateTimeline();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classes'] || changes['selectedDate']) {
      this.generateTimeline();
    }
  }

  private generateTimeline() {
    // Generate time slots for the selected date based on the classes
    this.timeSlots = this.createTimeSlots(this.classes, this.selectedDate);
  }

  private createTimeSlots(classes: Class[], date: Moment): TimelineSlot[] {

    // Define day start and end - working hours
    const dayStart = date.clone().hour(8).minute(0);
    const dayEnd = date.clone().hour(20).minute(0);
    const slots: TimelineSlot[] = [];

    // let currentTime = dayStart;
    let currentTime = dayStart.clone();

    // Sort classes by start time
    const sortedClasses = classes
      .map(cls => ({
        ...cls,
        startMoment: moment(cls.startdate),
        endMoment: moment(cls.enddate),
      }))
      .sort((a, b) => a.startMoment.valueOf() - b.startMoment.valueOf());

    for (const cls of sortedClasses) {
      const clsStartTime = cls.startMoment;
      const clsEndTime = cls.endMoment;

      // Ensure the class is on the selected date
      if (!clsStartTime.isSame(date, 'day')) {
        continue;
      }

      if (clsStartTime.isAfter(currentTime)) {
        // Free slot before the class
        slots.push({
          startTime: currentTime.clone(),
          endTime: clsStartTime.clone(),
          status: 'free',
        });
      }

      // Occupied slot for the class
      slots.push({
        startTime: clsStartTime.clone(),
        endTime: clsEndTime.clone(),
        status: 'occupied',
      });

      currentTime = clsEndTime.clone();
    }

    if (currentTime.isBefore(dayEnd)) {
      // Free slot after the last class
      slots.push({
        startTime: currentTime.clone(),
        endTime: dayEnd.clone(),
        status: 'free',
      });
    }

    return slots;
  }

  // method to be created in future
  onSlotClicked(timeSlot: TimelineSlot) {
    console.log('slot clicked', timeSlot);
  }
}