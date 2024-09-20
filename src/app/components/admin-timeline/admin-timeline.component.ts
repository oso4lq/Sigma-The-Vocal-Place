import { Component, computed, effect, OnDestroy, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Moment } from 'moment';
import moment from 'moment';
import { TimelineComponent } from '../timeline/timeline.component';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ClassesService } from '../../services/classes.service';
import { AuthService } from '../../services/auth.service';
import { Class, ClassStatus, TimelineSlot, UserData } from '../../interfaces/data.interface';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { filter, Subject, takeUntil } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import 'moment/locale/ru'; // Import Russian locale
import { UsersService } from '../../services/users.service';
import { DialogService } from '../../services/dialog.service';
import { MatButtonModule } from '@angular/material/button';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL', // Accessible date format
    monthYearA11yLabel: 'MMMM YYYY', // Accessible month-year format
  },
};

@Component({
  selector: 'app-admin-timeline',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    TimelineComponent,
  ],
  providers: [
    // { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
  ],
  templateUrl: './admin-timeline.component.html',
  styleUrls: ['./admin-timeline.component.scss']
})
export class AdminTimelineComponent implements OnInit, OnDestroy {

  // Forms
  displayForm: FormGroup; // Form for the Display Box
  rangeForm: FormGroup; // Form for the Date Range

  // Signals
  currentUserData: Signal<UserData | null> = computed(() => this.authService.currentUserDataSig()); // track the current user data
  users: Signal<UserData[]> = computed(() => this.usersService.userDatasSig()); // track the users array
  classes: Signal<Class[]> = computed(() => this.classesService.classesSig()); // track the classes array

  // State
  selectedClass: Class | undefined;
  ClassStatus = ClassStatus;
  classStatuses = Object.values(ClassStatus); // For options in <select>
  isStatusEditing: boolean = false; // Track editing the status
  userMap: Map<string | number, UserData> = new Map();
  daysInRange: moment.Moment[] = []; // Contain the range of dates for rendering timeline rows

  // Manage subscription
  private destroy$ = new Subject<void>();

  constructor(
    private classesService: ClassesService,
    private dialogService: DialogService,
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    // Set default date range: today to 7 days ahead
    const today = moment();
    const defaultStart = today.clone();
    const defaultEnd = today.clone().add(7, 'days');

    // Initialize the date range with the default dates
    this.rangeForm = this.fb.group({
      dateRange: this.fb.group({
        start: [defaultStart],
        end: [defaultEnd]
      }),
    });

    // Initialize the display form with empty fields
    this.displayForm = this.fb.group({
      status: [{ value: '', disabled: true }],
      date: [{ value: '', disabled: true }],
      time: [{ value: '', disabled: true }],
      message: [{ value: '', disabled: true }],
      membership: [{ value: '', disabled: true }],
      userName: [{ value: '', disabled: true }],
    });

    // Use an effect to watch for changes in the users signal
    effect(() => {
      const users = this.users();
      if (users && users.length > 0) {
        this.generateUserMap();
      }
    });
  }

  ngOnInit(): void {
    this.refreshData();

    // Subscribe to dateRange changes
    this.rangeForm.get('dateRange')?.valueChanges
      .pipe(
        filter(range => range && range.start && range.end),
        takeUntil(this.destroy$)
      )
      .subscribe(range => {
        const momentRange = {
          start: moment(range.start),
          end: moment(range.end)
        };
        this.onDateRangeChange(momentRange);
      });

    // Manually trigger onDateRangeChange to initialize daysInRange
    const initialRange = this.rangeForm.get('dateRange')?.value;
    if (initialRange && initialRange.start && initialRange.end) {
      this.onDateRangeChange({
        start: moment(initialRange.start),
        end: moment(initialRange.end)
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshData(): void {
    // Load and refresh classes and users signals
    this.classesService.loadClasses();
    this.usersService.loadUserDatas();
  }

  // Generate daysInRange based on selectedRange
  private generateDaysInRange(range: { start: Moment, end: Moment }): void {
    this.daysInRange = [];
    let currentDay = range.start.clone();
    while (currentDay.isSameOrBefore(range.end, 'day')) {
      this.daysInRange.push(currentDay.clone());
      currentDay.add(1, 'day');
    }
  }

  // Generate a map for quick user lookup
  private generateUserMap(): void {
    this.userMap.clear();

    this.users().forEach(user => {
      this.userMap.set(user.id, user);
    });
  }

  // Handle date range change
  private onDateRangeChange(range: { start: moment.Moment, end: moment.Moment }): void {

    // Refresh data
    this.refreshData();

    // Regenerate daysInRange
    this.generateDaysInRange(range);

    // Regenerate userMap
    this.generateUserMap();
  }

  // Populate the display form with class and user details
  private populateDisplayBox(cls: Class, user: UserData | undefined): void {
    if (!user) {
      console.warn(`User with ID ${cls.userId} not found.`);
      return;
    }

    const startMoment = moment(cls.startdate);
    const endMoment = moment(cls.enddate);
    const time = `${startMoment.format('HH:mm')} - ${endMoment.format('HH:mm')}`;

    // populate displayForm.status with current status, suggest other status options from ClassStatus enum
    this.displayForm.patchValue({
      status: cls.status,
      date: startMoment.format('DD.MM.YYYY'),
      time: time,
      message: cls.message,
      membership: cls.isMembershipUsed ? 'Да' : 'Нет',
      userName: user.name,
    });
  }

  // Handle slot click from TimelineComponent
  onSlotClicked(slot: TimelineSlot): void {
    const foundSelectedClass: Class | undefined = this.classes()
      .find(cls => cls.id === slot.classId);
    this.selectedClass = foundSelectedClass;

    if (foundSelectedClass) {
      const user = this.userMap.get(foundSelectedClass.userId);
      this.populateDisplayBox(foundSelectedClass, user);
    }
  }

  // Handle editing the class status
  toggleStatusEdit() {
    this.isStatusEditing = !this.isStatusEditing;

    // Enable or disable the status field based on editing state
    const statusControl = this.displayForm.get('status');
    if (statusControl) {
      if (this.isStatusEditing) {
        // Enable the status field for editing
        statusControl.enable();
      } else {
        // Disable the status field after editing
        statusControl.disable();

        // If the user is not in edit mode anymore, submit the data to Firebase
        if (this.selectedClass) {
          this.classesService.updateClass(this.selectedClass);
        }
      }
    }
  }

  // Handle status change in the form
  onStatusChange(newStatus: string): void {
    if (this.selectedClass) {
      if (Object.values(ClassStatus).includes(newStatus as ClassStatus)) {
        this.selectedClass.status = newStatus as ClassStatus;
      } else {
        console.warn(`Invalid status received: ${newStatus}`);
      }
    }
  }

  // Get classes for a specific day
  getClassesForDay(day: Moment): Class[] {
    const dayStart = day.clone().startOf('day');
    const dayEnd = day.clone().endOf('day');
    return this.classes().filter(cls => {
      const classEnd = moment(cls.enddate);
      return classEnd.isAfter(dayStart) && classEnd.isBefore(dayEnd);
    });
  }

  // Method to delete a class forever
  // IMPORTANT! Check for side effects related to membership points
  // seems to be ok
  deleteClass(cls: Class | undefined) {
    this.dialogService.openCancelClassDialog(cls);
  }

}