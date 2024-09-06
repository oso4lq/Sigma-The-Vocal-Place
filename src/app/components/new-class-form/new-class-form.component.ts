import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-new-class-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
  ],
  templateUrl: './new-class-form.component.html',
  styleUrl: './new-class-form.component.scss'
})
export class NewClassFormComponent {

  form: FormGroup;
  formState: 'StartState' | 'NewbieState' | 'ActiveSubState' | 'SubmitState' = 'StartState';
  isSubmitted = false;
  submitSuccess = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<NewClassFormComponent>,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      telegram: [''],
      date: [''],
      time: [''],
      message: [''],
    });
  }

  onUserTypeSelect(userType: string) {
    if (userType === 'new') {
      this.formState = 'NewbieState';
    } else if (userType === 'signed') {
      this.formState = 'ActiveSubState';
      this.form.patchValue({ name: 'John Doe' }); // Set default value for signed up users
    }
  }

  onSubmit() {
    const { name, phone, telegram } = this.form.value;

    // Validate the "new" user form
    if (this.formState === 'NewbieState') {
      if (!name) {
        this.showErrorMessage('You must enter your name to submit the form');
        return;
      }
      if (!phone && !telegram) {
        this.showErrorMessage('You must enter at least one contact to submit the form');
        return;
      }
    }

    // Validate the form
    if (this.form.valid) {
      this.isSubmitted = true;
      this.submitSuccess = true; // Simulate success
      this.formState = 'SubmitState';
    }

    // Close the dialog 5 seconds after submitting the form 
    setTimeout(() => this.closeDialog(), 5000);
  }

  // Show the error message for 5 seconds
  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  goBackToStart() {
    this.formState = 'StartState';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}