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
  @Input() currentTime: Moment = moment();
  @Input() mode: 'user' | 'admin' = 'user';

  @Output() slotClicked = new EventEmitter<TimelineSlot>();

  timeSlots: TimelineSlot[] = [];
  selectedTimeSlot: TimelineSlot | null = null;

  ngOnInit() {
    this.generateTimeline();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['classes'] || changes['selectedDate'] || changes['currentTime']) {
      this.generateTimeline();
    }
    // Reset selected slot when date or classes change
    this.selectedTimeSlot = null;
  }

  // Generate time slots for the selected date based on the received classes[]
  private generateTimeline() {
    this.timeSlots = this.createTimeSlots(this.classes, this.selectedDate);
  }

  // Create separate time slots
  private createTimeSlots(classes: Class[], date: Moment): TimelineSlot[] {
    const dayStart = date.clone().hour(8).minute(0).second(0);
    const dayEnd = date.clone().hour(20).minute(0).second(0);
    const slots: TimelineSlot[] = [];

    // Create a map of occupied times
    const occupiedTimes: { [key: string]: string | number } = {}; // Map time to classId

    classes.forEach(cls => {
      const clsStartTime = moment(cls.startdate);
      const clsEndTime = moment(cls.enddate);
      let time = clsStartTime.clone();

      while (time.isBefore(clsEndTime)) {
        const timeKey = time.format('HH:mm');
        occupiedTimes[timeKey] = cls.id;
        time.add(1, 'hour');
      }
    });

    // Generate 1-hour slots
    let currentSlotTime = dayStart.clone();
    while (currentSlotTime.isBefore(dayEnd)) {
      const slotEndTime = currentSlotTime.clone().add(1, 'hour');
      const slotKey = currentSlotTime.format('HH:mm');
      const isOccupied = occupiedTimes.hasOwnProperty(slotKey);
      const classId = isOccupied ? occupiedTimes[slotKey] : undefined;
      const status = isOccupied ? 'occupied' : 'free';

      slots.push({
        startTime: currentSlotTime.clone(),
        endTime: slotEndTime.clone(),
        status,
        classId,
      });

      currentSlotTime = slotEndTime;
    }

    return slots;
  }

  // Handle slot click based on mode
  onSlotClicked(timeSlot: TimelineSlot): void {
    this.slotClicked.emit(timeSlot);

    // Optionally, handle clicks on invalid slots
    if (this.mode === 'user' && timeSlot.status === 'free') {
      this.selectedTimeSlot = timeSlot;
    } else if (this.mode === 'admin' && timeSlot.status === 'occupied') {
      this.selectedTimeSlot = timeSlot;
    }
  }

  // Method to check if a time slot is selected
  isSelected(timeSlot: TimelineSlot): boolean {
    return this.selectedTimeSlot === timeSlot;
  }

}