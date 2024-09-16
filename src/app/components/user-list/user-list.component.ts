import { Component, computed, Signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Class, UserData } from '../../interfaces/data.interface';
import { UsersService } from '../../services/users.service';
import { ClassesService } from '../../services/classes.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  // Constants
  readonly imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  // Signals
  userDatas: Signal<UserData[]> = computed(() => this.usersService.userDatasSig());
  classes: Signal<Class[]> = computed(() => this.classesService.classesSig());

  // Forms
  searchForm: FormGroup;
  displayForm: FormGroup;

  // State
  selectedUser: UserData | null = null;
  selectedUserClasses: Class[] = [];
  isMembershipEditing: boolean = false; // Track editing the membership points
  filteredUsers: Signal<UserData[]>; // Filtered users as a computed signal

  constructor(
    private classesService: ClassesService,
    private usersService: UsersService,
    private fb: FormBuilder,
  ) {
    // Initialize Search Form
    this.searchForm = this.fb.group({
      search: ['']
    });

    // Initialize Display Form
    this.displayForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      telegram: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      membership: [{ value: '', disabled: true }],
    });

    // Initialize filteredUsers as a computed signal based on userDatas and search input
    this.filteredUsers = computed(() => {
      const users = this.userDatas();
      const searchValue = this.searchForm.get('search')?.value?.trim().toLowerCase() || '';

      if (!searchValue) {
        return users;
      }

      return users.filter(user =>
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        (user.telegram && user.telegram.toLowerCase().includes(searchValue)) ||
        (user.phone && user.phone.toLowerCase().includes(searchValue))
      );
    });
  }

  ngOnInit(): void {
    // Load initial data
    this.usersService.loadUserDatas();
    this.classesService.loadClasses();
  }

  ngOnDestroy(): void { }

  selectUser(user: UserData): void {
    this.selectedUser = user;
    this.populateDisplayForm(user);
    this.populateSelectedUserClasses(user);
  }

  // Populates the display form with the user's data
  private populateDisplayForm(user: UserData): void {
    this.displayForm.patchValue({
      name: user.name,
      email: user.email,
      telegram: user.telegram,
      phone: user.phone,
      membership: user.membership,
    });
  }

  // Filter classes by user and date (nearest first) 
  // and set the selectedUserClasses array based on the user's class IDs
  private populateSelectedUserClasses(user: UserData): void {
    if (!user.classes || user.classes.length === 0) {
      this.selectedUserClasses = [];
      return;
    }

    // Normalize class IDs to strings for comparison
    const userClassIds = user.classes.map(id => String(id));

    // Filter classes that belong to the user
    const matchedClasses = this.classes().filter(classItem =>
      userClassIds.includes(String(classItem.id))
    );

    // Filter out classes that have already ended
    const currentMoment = moment();
    const upcomingClasses = matchedClasses.filter(classItem => {
      const endDate = moment(classItem.enddate);
      return endDate.isAfter(currentMoment);
    });

    // Sort the classes by the start date (nearest date first)
    this.selectedUserClasses = upcomingClasses.sort((a, b) => {
      const dateA = new Date(a.startdate).getTime();
      const dateB = new Date(b.startdate).getTime();
      return dateA - dateB;
    });
  }

  // Handle editing the membership points
  toggleMembershipEdit() {
    this.isMembershipEditing = !this.isMembershipEditing;

    // Enable or disable the status field based on editing state
    const membershipControl = this.displayForm.get('membership');
    if (membershipControl) {
      if (this.isMembershipEditing) {
        // Enable the membership field for editing
        membershipControl.enable();
      } else {
        // Disable the membership field after editing
        membershipControl.disable();

        // // If the user is not in edit mode anymore, submit the data to Firebase
        // if (this.selectedUser) {
        //   console.log("Updating class data on the server:", this.selectedUser);
        //   this.usersService.updateUserData(this.selectedUser);
        // }

        // Retrieve the updated value from the form
        const updatedMembership = this.displayForm.get('membership')?.value;

        // Update the selectedUser's membership points
        if (this.selectedUser) {
          const updatedUser: UserData = {
            ...this.selectedUser,
            membership: updatedMembership
          };
          console.log("Updating user data on the server:", updatedUser);
          this.usersService.updateUserData(updatedUser);
          this.selectedUser = updatedUser;
        }
      }
    }
  }

  deleteClass(cls: Class) {
    console.log('Class to be deleted:', cls);
  }

}
