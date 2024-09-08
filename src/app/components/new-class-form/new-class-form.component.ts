import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';

enum FormState {
  Start = 'StartState',
  Newbie = 'NewbieState',
  ActiveSub = 'ActiveSubState',
  Submit = 'SubmitState'
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
    // RouterModule,
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
export class NewClassFormComponent {

  newbieForm: FormGroup;
  activeSubForm: FormGroup;
  currentFormState: FormState = FormState.Start;
  prevFormState: FormState | null = null;
  isSubmitted = false;
  submitSuccess = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<NewClassFormComponent>,
    private router: Router, // Inject the Router
    private fb: FormBuilder,
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
      name: ['John Doe', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      message: [''],
    });
  }

  // Dynamically return the current form
  get currentForm(): FormGroup {
    return this.currentFormState === FormState.Newbie ? this.newbieForm : this.activeSubForm;
  }

  // Switch between form states
  onUserTypeSelect(userType: string) {
    this.prevFormState = userType === 'new' ? FormState.Newbie : FormState.ActiveSub;
    this.currentFormState = this.prevFormState;
  }

  // Form submission
  onSubmit() {
    console.log('Form submitted:', this.currentForm.value);

    // Validate for NewbieState
    if (this.currentFormState === FormState.Newbie) {
      if (!this.newbieForm.get('name')?.value) {
        this.showErrorMessage('You must enter your name to submit the form');
        return;
      }
      if (!this.newbieForm.get('phone')?.value && !this.newbieForm.get('telegram')?.value) {
        this.showErrorMessage('You must enter at least one contact to submit the form');
        return;
      }
    }

    // Validate for ActiveSubState
    if (this.currentFormState === FormState.ActiveSub) {
      const date = this.activeSubForm.get('date')?.value;
      const time = this.activeSubForm.get('time')?.value;

      // Check if date or time is missing
      if (!date || !time) {
        const missingFields = [];
        if (!date) missingFields.push('date');
        if (!time) missingFields.push('time');
        this.showErrorMessage(`Please fill in the ${missingFields.join(' and ')}`);
        return;
      }
    }

    // If form is valid, switch to SubmitState
    if (this.currentForm.valid) {
      this.isSubmitted = true;
      this.submitSuccess = true;
      this.currentFormState = FormState.Submit;

      // Close the dialog 5 seconds after submitting the form
      setTimeout(() => this.closeDialog(), 5000);
    }
  }

  // Show error message for 5 seconds
  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 5000);
  }

  // Go back to the start state
  goBackToStart() {
    this.currentFormState = FormState.Start;
    this.errorMessage = '';

    // Reset the newbieForm
    this.newbieForm.reset();

    // Reset the activeSubForm
    this.activeSubForm = this.fb.group({
      name: ['John Doe', Validators.required],
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