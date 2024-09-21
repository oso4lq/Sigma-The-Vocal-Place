import { Component, Inject } from '@angular/core';
import { Class, ClassStatus } from '../../interfaces/data.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import moment from 'moment';

@Component({
  selector: 'app-edit-class',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './edit-class.component.html',
  styleUrl: './edit-class.component.scss'
})
export class EditClassComponent {

  // Enum and class statuses
  ClassStatus = ClassStatus;
  classStatuses = Object.values(ClassStatus);

  // Form group
  editForm: FormGroup;

  // Class data passed to the dialog
  classItem: Class;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { classItem: Class },
    private dialogRef: MatDialogRef<EditClassComponent>,
    private classesService: ClassesService,
    private fb: FormBuilder,
  ) {
    this.classItem = data.classItem;

    const startMoment = moment(this.classItem.startdate);
    // Initialize the form with class details
    this.editForm = this.fb.group({
      status: [this.classItem.status, Validators.required],
      date: [{ value: startMoment.format('LLL'), disabled: true }],
      message: [{ value: this.classItem.message, disabled: true }],
      membership: [{ value: this.classItem.isMembershipUsed ? 'Да' : 'Нет', disabled: true }],
    });
  }

  // Confirm edited status and update the Class data
  confirmEdit(): void {
    if (this.editForm.invalid) {
      return;
    }

    // Get the updated status from the form
    const updatedStatus: ClassStatus = this.editForm.get('status')?.value;

    // Create an updated class object
    const updatedClass: Class = {
      ...this.classItem,
      status: updatedStatus
    };

    this.classesService.updateClass(updatedClass);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}