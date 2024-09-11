import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

enum FormLoginState {
  Login = 'LoginState',
  Submit = 'SubmitState',
  Success = 'SuccessState',
  Error = 'ErrorState',
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  currentFormState: FormLoginState = FormLoginState.Login;
  errorMessage = '';

  // isSubmitted for waiting for response
  isSubmitted = false;
  // submitSuccess for received positive response
  submitSuccess = false;

  // isSuccessful var is for development purposes, bound to checkbox
  isSuccessful = false;

  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      success: [], // Bind checkbox for development purposes
    });
  }

  // Form submission
  onSubmit() {
    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;
    this.isSuccessful = this.loginForm.get('success')?.value; // Checkbox for development purposes

    if (!login || !password) {
      const missingFields = [];
      if (!login) missingFields.push('логин');
      if (!password) missingFields.push('пароль');
      this.showErrorMessage(`Пожалуйста, введите ${missingFields.join(' и ')}`);
      return;
    }

    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.isSubmitted = true;
      this.currentFormState = FormLoginState.Submit;

      if (this.isSuccessful) {
        setTimeout(() => {
          this.submitSuccess = true;
          this.currentFormState = FormLoginState.Success;
          setTimeout(() => this.closeDialogAndNavigate(), 1000);
        }, 3000);
      } else {
        setTimeout(() => {
          this.submitSuccess = false;
          this.currentFormState = FormLoginState.Error;
          setTimeout(() => this.closeDialog(), 3000);
        }, 3000);
      }
    }
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 5000);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private closeDialogAndNavigate(): void {
    this.dialogRef.close();
    this.router.navigate(['/user']);
  }
}