import { Component, computed, OnInit, Signal } from '@angular/core';
import { Class, UserData } from '../../interfaces/data.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ClassesService } from '../../services/classes.service';
import { AuthService } from '../../services/auth.service';
import { UsersFirebaseService } from '../../services/users-firebase.service';
import { DialogService } from '../../services/dialog.service';
import { User } from 'firebase/auth';
import moment from 'moment';

@Component({
  selector: 'app-user-page',
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
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  isEditing = false; // Track whether inputs are editable
  userData: UserData | null = null; // Store the fetched user data
  imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  constructor(
    private usersFirebaseService: UsersFirebaseService,
    private classesService: ClassesService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) { }

  currentUser: Signal<User | null | undefined> = computed(() => this.authService.currentUserSig()); // track the current user
  currentUserData: Signal<UserData | null> = computed(() => this.authService.currentUserDataSig()); // track the current user data
  classes: Signal<Class[]> = computed(() => this.classesService.classesSig()); // track the classes array

  // Filtered and sorted classes that match the user's registered classes
  filteredClasses = computed(() => {
    if (!this.userData || !this.userData.classes) return [];

    // Filter classes by user's class IDs
    const userClassIds = this.userData.classes.map((id: string | number) => String(id));

    // Match the available classes with the user's class IDs
    const matchedClasses = this.classes().filter((classItem: Class) =>
      userClassIds.includes(String(classItem.id))
    );

    // Filter out classes that have already ended
    const currentMoment = moment();
    const upcomingClasses = matchedClasses.filter((classItem: Class) => {
      const endDate = moment(classItem.enddate);
      return endDate.isAfter(currentMoment);
    });

    // Sort the classes by the start date (nearest date first)
    return upcomingClasses.sort((a: Class, b: Class) => {
      const dateA = new Date(a.startdate).getTime();
      const dateB = new Date(b.startdate).getTime();
      return dateA - dateB;
    });
  });

  ngOnInit(): void {
    this.classesService.loadClasses();
    this.userData = this.currentUserData();
  }

  refreshClasses() {
    // Refresh the currentUserData signal to check updates in classes[]
    this.authService.monitorAuthState();

    // Refresh the classes
    const newUserData = this.authService.currentUserDataSig();
    if (newUserData) {
      this.userData = newUserData;
      this.classesService.loadClasses();
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    // If the user is not in edit mode anymore, submit the data to Firebase
    if (!this.isEditing && this.userData) {
      console.log("Updating user details on the server:", this.userData);

      // Call the updateUser method from UsersFirebaseService
      this.usersFirebaseService.updateUser(this.userData).then(() => {
        console.log('User data successfully updated in Firestore');
      }).catch(error => {
        console.error('Error updating user data:', error);
      });
    }
  }

  cancelClass(classItem: Class) {
    console.log('Cancel class');
    this.dialogService.openCancelClassDialog(classItem);
  }

  logout() {
    this.authService.logout();
  }

  openForm() {
    this.dialogService.openForm();
  }

  getMembershipText(membership: number): string {
    if (membership === 1) return `осталось ${membership} занятие`;
    if (membership > 1 && membership < 5) return `осталось ${membership} занятия`;
    if (membership >= 5) return `осталось ${membership} занятий`;
    return `Чтобы приобрести абонемент, свяжитесь с преподавателем.`;
  }
}
