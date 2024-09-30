import { Component, computed, effect, OnInit, Signal } from '@angular/core';
import { Class, ClassStatus, UserData } from '../../interfaces/data.interface';
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
import { DialogService } from '../../services/dialog.service';
import { User } from 'firebase/auth';
import moment from 'moment';
import { AdminTimelineComponent } from '../admin-timeline/admin-timeline.component';
import { UserListComponent } from '../user-list/user-list.component';
import { UsersService } from '../../services/users.service';

export enum UserPageSections {
  User = 'UserSection',
  Timeline = 'TimelineSection',
  UserList = 'UserListSection',
}

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    AdminTimelineComponent,
    UserListComponent,
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  // Constants  
  readonly imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  // State
  isUserDataEditing: boolean = false; // Track whether inputs are editable
  userData: UserData | null = null; // Store the fetched user data
  UserPageSections = UserPageSections;
  ClassStatus = ClassStatus;
  currentSection: UserPageSections = UserPageSections.User; // Default section

  // Signals
  currentUser: Signal<User | null | undefined> = computed(() => this.authService.currentUserSig()); // track the current user
  currentUserData: Signal<UserData | null> = computed(() => this.authService.currentUserDataSig()); // track the current user data
  classes: Signal<Class[]> = computed(() => this.classesService.classesSig()); // track the classes array

  // Telegram data
  displayedTelegram: string = '';
  telegramError: string = ''; // For validation errors

  constructor(
    private classesService: ClassesService,
    private dialogService: DialogService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    // Use effect to watch for changes in currentUserData
    effect(() => {
      const data = this.currentUserData();
      if (data) {
        this.userData = data;
        this.initializeDisplayedTelegram();
      } else {
        this.userData = null;
        this.displayedTelegram = '';
      }
    });
  }

  // Filtered and sorted classes that match the user's registered classes
  filteredClasses = computed(() => {
    const localUserData = this.currentUserData();

    if (!localUserData || !localUserData.classes) return [];

    // Update this.userData with fresh value
    this.userData = localUserData;
    // Filter classes by user's class IDs
    const userClassIds = localUserData.classes.map((id: string | number) => String(id));
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

  // Method to switch sections
  switchSection(section: UserPageSections) {
    this.currentSection = section;
  }

  refreshClasses() {
    // Refresh the currentUserData signal to check updates in classes[]
    this.authService.monitorAuthState();

    // Refresh the classes
    this.classesService.loadClasses();
  }

  // Method to initialize displayedTelegram
  private initializeDisplayedTelegram(): void {
    if (this.userData && this.userData.telegram) {
      // Add "@" prefix if not already present
      this.displayedTelegram = this.userData.telegram.startsWith('@')
        ? this.userData.telegram
        : `@${this.userData.telegram}`;
    } else {
      this.displayedTelegram = '';
    }
  }

  // Edit and update the userData
  toggleEdit() {
    this.isUserDataEditing = !this.isUserDataEditing;

    // If the user finished editing, process and submit the data to Firebase
    if (!this.isUserDataEditing && this.userData) {
      // Validate Telegram username before saving
      if (this.isValidTelegram(this.displayedTelegram)) {
        this.telegramError = '';
        this.processAndSaveTelegram();
        this.usersService.updateUserData(this.userData);
      } else {
        // Set error message and keep editing mode open
        this.telegramError = 'Invalid Telegram username. Please enter a valid username.';
        this.isUserDataEditing = true;
      }
    }
  }

  // Method to process displayedTelegram and update userData.telegram
  private processAndSaveTelegram(): void {
    if (this.displayedTelegram.startsWith('@')) {
      // Remove "@" symbol before saving
      this.userData!.telegram = this.displayedTelegram.substring(1);
    } else {
      // Save as is
      this.userData!.telegram = this.displayedTelegram;
    }
  }

  // Method to validate Telegram username
  private isValidTelegram(username: string): boolean {
    // Example: Telegram usernames can have letters, numbers, and underscores, and must be 5-32 characters
    const telegramRegex = /^@?[A-Za-z0-9_]{5,32}$/;
    return telegramRegex.test(username);
  }

  cancelClass(classItem: Class) {
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
