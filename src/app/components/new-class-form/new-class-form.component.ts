import { CommonModule } from '@angular/common';
import { Component, computed, effect, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { Class, ClassStatus, TimelineSlot } from '../../interfaces/data.interface';
import { ClassesService } from '../../services/classes.service';
import { UsersFirebaseService } from '../../services/users-firebase.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import moment, { Moment } from 'moment';
import { TimelineComponent } from '../timeline/timeline.component';
import { ClassesFirebaseService } from '../../services/classes-firebase.service';
import { collection, doc, writeBatch } from '@angular/fire/firestore';

enum FormClassState {
  Start = 'StartState',
  Newbie = 'NewbieState',
  ActiveSub = 'ActiveSubState',
  Submit = 'SubmitState',
  Success = 'SuccessState',
  Error = 'ErrorState',
}

@Component({
  selector: 'app-new-class-form',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    TimelineComponent,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
  ],
  templateUrl: './new-class-form.component.html',
  styleUrl: './new-class-form.component.scss'
})
export class NewClassFormComponent implements OnInit {

  newbieForm: FormGroup;
  activeSubForm: FormGroup;
  currentFormState: FormClassState = FormClassState.Start;
  prevFormState: FormClassState | null = null;
  errorMessage = '';

  // New properties
  selectedDate: Moment = moment(); // Initialize with current date
  classes: Signal<Class[]>  = computed(() => this.classesService.classesSig()); // Track the classes array
  classesForSelectedDate: Class[] = []; // Contain the classes[] for the selected date

  constructor(
    private dialogRef: MatDialogRef<NewClassFormComponent>,
    private classesFirebaseService: ClassesFirebaseService,
    private usersFirebaseService: UsersFirebaseService,
    private classesService: ClassesService,
    private dialogService: DialogService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    // Newbie form
    this.newbieForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      telegram: [''],
      message: [''],
    });

    // ActiveSub form
    this.activeSubForm = this.fb.group({
      name: ['', Validators.required], // Will be updated with user's name if authenticated
      date: [this.selectedDate.toDate(), Validators.required], // Initialize with current date
      time: ['', Validators.required],
      message: [''],
    });

    // Fetch all classes
    this.classesService.loadClasses();

    // Subscribe to classes changes
    effect(() => {
      const allClasses = this.classes(); // Using computed signal
      this.filterClassesForDate(this.selectedDate, allClasses);
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated and optionally populate the form
    const userData = this.authService.currentUserDataSig();
    if (userData) {
      this.currentFormState = FormClassState.ActiveSub;
      this.activeSubForm.patchValue({
        name: userData.name,
      });
    } else {
      this.currentFormState = FormClassState.Start;
    }
  }

  // Dynamically return the current form
  get currentForm(): FormGroup {
    return this.currentFormState === FormClassState.Newbie ? this.newbieForm : this.activeSubForm;
  }

  // Switch between form states, validate if the user is authenticated
  onUserTypeSelect(userType: string) {
    if (userType === 'new') {
      this.prevFormState = this.currentFormState;
      this.currentFormState = FormClassState.Newbie;
    } else if (userType === 'signed') {
      const userData = this.authService.currentUserDataSig();
      if (userData) {
        this.prevFormState = this.currentFormState;
        this.currentFormState = FormClassState.ActiveSub;
        this.activeSubForm.patchValue({
          name: userData.name,
          date: this.selectedDate.toDate(), // Set date to current date
        });
      } else {
        this.closeDialog();
        this.dialogService.openLogin();
      }
    }
  }

  // Handle date changes
  onDateChange(event: any) {
    const date = event.value ? moment(event.value) : moment();
    this.selectedDate = date;

    // Update the date in the form (Clear time)
    this.activeSubForm.patchValue({ date: date.toDate(), time: '' });

    // Fetch classes for the selected date
    const allClasses = this.classes();
    this.filterClassesForDate(date, allClasses);
  }

  // Filter classes for the selected date
  filterClassesForDate(date: Moment, allClasses: Class[]) {
    this.classesForSelectedDate = allClasses.filter(cls => {
      const clsDate = moment(cls.startdate);
      return clsDate.isSame(date, 'day');
    });
  }

  onTimeSlotSelected(timeSlot: TimelineSlot) {
    if (timeSlot.status === 'free') {
      // Set time in the form (extract time from Moment object)
      const timeString = timeSlot.startTime.format('HH:mm');
      this.activeSubForm.patchValue({ time: timeString });
      this.errorMessage = '';
    } else {
      // Show error message
      this.showErrorMessage('Это время недоступно');
      // Clear time input
      this.activeSubForm.patchValue({ time: '' });
    }
  }

  async onSubmit() {
    if (this.validateForm()) {
      await this.createNewClass();
    }
  }

  private validateForm(): boolean {
    if (this.currentFormState === FormClassState.Newbie) {
      if (!this.newbieForm.get('name')?.value) {
        this.showErrorMessage('Пожалуйста, укажите имя');
        return false;
      }
      if (!this.newbieForm.get('phone')?.value && !this.newbieForm.get('telegram')?.value) {
        this.showErrorMessage('Пожалуйста, укажите хотя бы один способ связи');
        return false;
      }
    }

    if (this.currentFormState === FormClassState.ActiveSub) {
      const date = this.activeSubForm.get('date')?.value;
      const time = this.activeSubForm.get('time')?.value;

      if (!date || !time) {
        const missingFields = [];
        if (!date) missingFields.push('дату');
        if (!time) missingFields.push('время');
        this.showErrorMessage(`Пожалуйста, укажите ${missingFields.join(' и ')}`);
        return false;
      }
    }
    return true;
  }

  async createNewClass() {
    const { date, time } = this.activeSubForm.value;
    try {
      this.prevFormState = this.currentFormState;
      this.currentFormState = FormClassState.Submit;

      const userData = this.authService.currentUserDataSig();
      if (!userData) throw new Error('User not authenticated');

      // Check if the user has membership points
      let isMembershipUsed = false;
      if (userData.membership && userData.membership > 0) {
        // Decrement membership points
        userData.membership -= 1;
        isMembershipUsed = true;
      }

      // Create new class object
      const newClass: Class = {
        id: '', // Firestore will auto-generate the ID
        status: ClassStatus.Pending,
        startdate: this.generateISODateTime(date, time),
        enddate: this.generateISODateTime(date, time, 1), // Add 1 hour to the end date
        isMembershipUsed: isMembershipUsed,
        userId: userData.id, // Link the class to the user
      };

      // Create a batch
      const batch = writeBatch(this.classesFirebaseService.firestore);

      // Create a new document reference for the class
      const classDocRef = doc(collection(this.classesFirebaseService.firestore, 'classes'));
      newClass.id = classDocRef.id;

      // Add the class to the batch
      batch.set(classDocRef, newClass);

      // Update user's classes array with the new class ID
      userData.classes = [...(userData.classes || []), classDocRef.id];

      // Prepare the user document reference
      const userDocRef = doc(this.usersFirebaseService.firestore, `users/${userData.id}`);

      // Update user data in the batch
      batch.update(userDocRef, {
        membership: userData.membership,
        classes: userData.classes,
      });

      // Commit the batch
      await batch.commit();

      // Switch state to successful and close the dialog
      this.currentFormState = FormClassState.Success;
      this.router.navigate(['/user']);
      setTimeout(() => this.closeDialog(), 5000);
    } catch (error) {
      this.currentFormState = FormClassState.Error;
      this.showErrorMessage('Произошла ошибка во время отправления запроса. Пожалуйста, попробуйте снова.');
      setTimeout(() => this.closeDialog(), 5000);
    }
  }

  // Generate ISO8601 date string
  private generateISODateTime(date: Date, time: string, hourOffset: number = 0): string {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours + hourOffset, minutes);
    return dateTime.toISOString();
  }

  // Show error message for 5 seconds
  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 5000);
  }

  // Go back to the start state
  goBackToStart() {
    this.currentFormState = FormClassState.Start;
    this.errorMessage = '';

    // Reset the newbieForm
    this.newbieForm.reset();

    // Reset the activeSubForm
    this.activeSubForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      message: [''],
    });
  }

  // Close dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Close the dialog and navigate
  closeDialogAndNavigate(): void {
    this.dialogRef.close();
    this.router.navigate(['/privacy-policy']);
  }
}