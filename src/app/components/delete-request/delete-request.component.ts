import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { newUserRequest } from '../../interfaces/data.interface';
import { RequestsService } from '../../services/requests.service';

@Component({
  selector: 'app-delete-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './delete-request.component.html',
  styleUrl: './delete-request.component.scss'
})
export class DeleteRequestComponent {

  // Form group
  deleteRequestForm: FormGroup;

  // Class data passed to the dialog
  requestItem: newUserRequest;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { requestItem: newUserRequest },
    private dialogRef: MatDialogRef<DeleteRequestComponent>,
    private requestsService: RequestsService,
    private fb: FormBuilder,
  ) {
    this.requestItem = data.requestItem;

    // Initialize the form with class details
    this.deleteRequestForm = this.fb.group({
      date: [{ value: this.requestItem.date.toLocaleLowerCase(), disabled: true }],
      name: [{ value: this.requestItem.name, disabled: true }],
    });
  }

  // Confirm edited status and update the Class data
  confirmDelete(): void {
    if (this.deleteRequestForm.invalid) {
      return;
    }

    this.requestsService.deleteRequest(this.requestItem);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}