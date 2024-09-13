import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';

enum FormClassState {
  Start = 'StartState',
  Newbie = 'NewbieState',
  ActiveSub = 'ActiveSubState',
  Submit = 'SubmitState',
}

@Component({
  selector: 'app-new-class-form',
  standalone: true,
  imports: [
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
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    // { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
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

  // isSubmitted for waiting for responce
  isSubmitted = false;
  // submitSuccess for received positive responce
  submitSuccess = false;

  constructor(
    private dialogRef: MatDialogRef<NewClassFormComponent>,
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
      date: ['', Validators.required],
      time: ['', Validators.required],
      message: [''],
    });
  }

  ngOnInit(): void {
    // Check if the user is authenticated
    const userData = this.authService.currentUserDataSig();
    console.log('userData', userData);
    if (userData) {
      // User is authenticated, go straight to ActiveSubState
      this.currentFormState = FormClassState.ActiveSub;
      this.activeSubForm.patchValue({
        name: userData.name, // Auto-fill the user's name
      });
    } else {
      // User is not authenticated, start in StartState
      this.currentFormState = FormClassState.Start;
    }
  }

  // Dynamically return the current form
  get currentForm(): FormGroup {
    return this.currentFormState === FormClassState.Newbie ? this.newbieForm : this.activeSubForm;
  }

  // Switch between form states
  onUserTypeSelect(userType: string) {

    // this.prevFormState = userType === 'new' ? FormClassState.Newbie : FormClassState.ActiveSub;
    // this.currentFormState = this.prevFormState;

    if (userType === 'new') {
      this.prevFormState = FormClassState.Newbie;
      this.currentFormState = FormClassState.Newbie;
    } else if (userType === 'signed') {
      const userData = this.authService.currentUserDataSig();

      if (userData) {
        // User is authenticated, go to ActiveSubState
        this.prevFormState = FormClassState.ActiveSub;
        this.currentFormState = FormClassState.ActiveSub;
        this.activeSubForm.patchValue({
          name: userData.name, // Auto-fill the user's name
        });
      } else {
        // User is not authenticated, close this dialog and open login form
        this.closeDialog();
        this.dialogService.openLogin(); // Open the login form
      }
    }
  }

  // Form submission
  onSubmit() {

    // Validate for NewbieState
    if (this.currentFormState === FormClassState.Newbie) {
      if (!this.newbieForm.get('name')?.value) {
        // this.showErrorMessage('You must enter your name to submit the form');
        this.showErrorMessage('Пожалуйста, укажите имя');
        return;
      }
      if (!this.newbieForm.get('phone')?.value && !this.newbieForm.get('telegram')?.value) {
        // this.showErrorMessage('You must enter at least one contact to submit the form');
        this.showErrorMessage('Пожалуйста, укажите хотя бы один способ связи');
        return;
      }
    }

    // Validate for ActiveSubState
    if (this.currentFormState === FormClassState.ActiveSub) {
      const date = this.activeSubForm.get('date')?.value;
      const time = this.activeSubForm.get('time')?.value;

      // Check if date or time is missing
      if (!date || !time) {
        const missingFields = [];
        if (!date) missingFields.push('дату');
        if (!time) missingFields.push('время');
        this.showErrorMessage(`Пожалуйста, укажите ${missingFields.join(' и ')}`);
        return;
      }
    }

    // If form is valid, switch to SubmitState
    if (this.currentForm.valid) {
      this.isSubmitted = true;
      this.submitSuccess = true;
      this.currentFormState = FormClassState.Submit;

      // Close the dialog 5 seconds after submitting the form
      setTimeout(() => this.closeDialog(), 5000);
    }
  }

  // Show error message for 5 seconds
  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 5000);
  }


  // Handle back button press
  // UNRESOLVED LOGIC
  handleBackButton() {
    if (this.currentFormState === FormClassState.Newbie || this.currentFormState === FormClassState.ActiveSub) {
      console.log('handleBackButton back');
      this.goBackToStart(); // Switch back to StartState if in NewbieState or ActiveSubState
    } else if (this.currentFormState === FormClassState.Start) {
      console.log('handleBackButton close');
      this.closeDialog(); // Close the dialog if in StartState
    }
  }


  // Go back to the start state
  goBackToStart() {
    this.currentFormState = FormClassState.Start;
    this.errorMessage = '';

    // Reset the newbieForm
    this.newbieForm.reset();

    // Reset the activeSubForm
    this.activeSubForm = this.fb.group({
      // name: ['John Doe', Validators.required],
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