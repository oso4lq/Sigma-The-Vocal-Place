import { Component, Inject, OnInit } from '@angular/core';
import { Class, ClassStatus, UserData } from '../../interfaces/data.interface';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UsersFirebaseService } from '../../services/users-firebase.service';
import { AuthService } from '../../services/auth.service';
import moment from 'moment';
import { doc, getDoc, writeBatch } from '@angular/fire/firestore';
import { ClassesFirebaseService } from '../../services/classes-firebase.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cancel-class',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './cancel-class.component.html',
  styleUrl: './cancel-class.component.scss'
})
export class CancelClassComponent implements OnInit {

  classItem: Class;
  userData: UserData | null;
  message: string = ''; // Extra field for alerts and errors
  hoursDifference: number = 0;
  CANCELLATION_THRESHOLD_HOURS = 24; // Deadline to cancel the class without penalty

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { classItem: Class },
    private dialogRef: MatDialogRef<CancelClassComponent>,
    private classesFirebaseService: ClassesFirebaseService,
    private usersFirebaseService: UsersFirebaseService,
    private authService: AuthService,
  ) {
    this.classItem = data.classItem;
    this.userData = this.authService.currentUserDataSig();
  }

  ngOnInit(): void {
    this.updateMessage();
  }

  updateMessage(): void {
    const currentDate = moment();
    const classStartDate = moment(this.classItem.startdate);
    this.hoursDifference = classStartDate.diff(currentDate, 'hours');

    // Notify the user that he will lose a membership point if:
    // - it's less than 24hrs to this class
    // - the user spent his membership point
    // - the class was confirmed by the tutor

    // IMPORTANT!
    // If the class has not been confirmed by the tutor, the policy allows the user 
    // to cancel without penalty, even if it's less than 24 hours before the class.

    if (
      this.hoursDifference <= this.CANCELLATION_THRESHOLD_HOURS &&
      this.classItem.isMembershipUsed &&
      this.classItem.status === ClassStatus.Confirmed
    ) {
      this.message =
        'Преподаватель уже подтвердил это занятие, и до его начала остаётся менее 24 часов. Отменив это занятие, вы потеряете занятие из абонемента.';
    } else if (
      this.classItem.isMembershipUsed &&
      this.classItem.status !== ClassStatus.Executed
    ) {
      this.message = 'Вы можете отменить урок без потери занятия из абонемента.';
    } else this.message = '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async confirmCancel(): Promise<void> {
    try {
      // Fetch the latest class data
      const classDocRef = doc(
        this.classesFirebaseService.firestore,
        `classes/${this.classItem.id}`
      );
      const classSnapshot = await getDoc(classDocRef);
      if (!classSnapshot.exists()) {
        throw new Error('Class no longer exists.');
      }
      const latestClassData = classSnapshot.data() as Class;
      console.log('latestClassData', latestClassData);
      this.classItem.status = latestClassData.status;

      // Create a batch for atomic updates
      const batch = writeBatch(this.classesFirebaseService.firestore);

      // Delete the class
      batch.delete(classDocRef);

      if (!this.userData) {
        throw new Error('User data not available');
      }

      // Remove class ID from user's classes array
      const updatedUserDataClasses = (this.userData.classes || []).filter(
        (id: string | number) => id !== this.classItem.id
      );

      // Prepare user data update
      const userDocRef = doc(
        this.usersFirebaseService.firestore,
        `users/${this.userData.id}`
      );
      const userUpdateData: Partial<UserData> = {
        classes: updatedUserDataClasses,
      };
      console.log('userUpdateData', userUpdateData);

      // IMPORTANT! Adjust membership points based on cancellation policy.

      // Refund membership point if cancellation of a CONFIRMED CLASS is made MORE THAN 24 HOURS
      // before the class starts and the user USED A MEMBERSHIP POINT.
      // OR 
      // Refund membership point if cancellation of a PENDING CLASS is made at ANY TIME
      // and the user USED A MEMBERSHIP POINT.
      // OR
      // Refund membership point if cancellation of a CANCELLED CLASS is made at ANY TIME
      // and the user USED A MEMBERSHIP POINT.

      if (
        (this.hoursDifference >= this.CANCELLATION_THRESHOLD_HOURS
          && this.classItem.isMembershipUsed)
        ||
        (this.classItem.isMembershipUsed
          && this.classItem.status === ClassStatus.Pending)
        ||
        (this.classItem.isMembershipUsed
          && this.classItem.status === ClassStatus.Cancelled)
      ) {
        // Refund membership point
        userUpdateData.membership = (this.userData.membership || 0) + 1;
      }

      // Update user data in batch
      batch.update(userDocRef, userUpdateData);

      // Commit the batch
      await batch.commit();

      // Close the dialog and possibly refresh data
      this.dialogRef.close({ success: true });
    } catch (error) {
      console.error('Error cancelling class:', error);
      this.message =
        'Произошла ошибка при отмене занятия. Пожалуйста, попробуйте снова или свяжитесь с поддержкой.';
    }
  }

}