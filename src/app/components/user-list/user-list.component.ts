import { Component, computed, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Class, UserData } from '../../interfaces/data.interface';
import { UsersService } from '../../services/users.service';
import { ClassesService } from '../../services/classes.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';
import { MobileService } from '../../services/mobile.service';
import { MatButtonModule } from '@angular/material/button';
import { RequestListComponent } from '../request-list/request-list.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    RequestListComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  @ViewChild('drawer') drawer!: MatSidenav;
  displayedColumns: string[] = ['user', 'membership', 'classes', 'telegram', 'phone', 'email'];

  // Constants
  readonly imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  // Forms
  searchForm: FormGroup;
  displayForm: FormGroup;

  // State as Signals
  selectedUser: WritableSignal<UserData | null> = signal(null); // Update selected user data
  isMembershipEditing: WritableSignal<boolean> = signal(false); // Track editing the membership points

  // Signals from Services
  userDatas: Signal<UserData[]> = computed(() => this.usersService.userDatasSig());
  classes: Signal<Class[]> = computed(() => this.classesService.classesSig());

  // Search input as a signal to track changes
  searchInput: WritableSignal<string> = signal('');

  // For tracking swipe gestures
  private swipeDrawerTrackingEnabled: boolean = true;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private touchStartY: number = 0;
  private touchEndY: number = 0;
  // Minimum distance for a valid horizontal swipe
  private readonly minSwipeDeltaX = 50;
  // Maximum Y-axis movement allowed for a valid horizontal swipe
  private readonly maxSwipeDeltaY = 30;

  // Computed signal for filtered users
  filteredUsers: Signal<UserData[]> = computed(() => {
    const users = this.userDatas();
    const searchValue = this.searchInput().trim().toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter(user =>
      user.name?.toLowerCase().includes(searchValue)
      // || user.email?.toLowerCase().includes(searchValue)
      // || user.telegram?.toLowerCase().includes(searchValue)
      // || user.phone?.toLowerCase().includes(searchValue)
    );
  });

  // Computed signal for selected user's classes - simplified filtering conditions from UserPageComponent (no past-filter)
  selectedUserClasses: Signal<Class[]> = computed(() => {
    const user = this.selectedUser();
    if (!user || !user.classes || user.classes.length === 0) {
      return [];
    }

    // Normalize class IDs to strings for comparison
    const userClassIds = user.classes.map(id => String(id));

    // Filter classes that belong to the user
    const matchedClasses = this.classes().filter(classItem =>
      userClassIds.includes(String(classItem.id))
    );

    // Sort the classes by the start date (nearest date first)
    return matchedClasses.sort((a, b) => {
      const dateA = new Date(a.startdate).getTime();
      const dateB = new Date(b.startdate).getTime();
      return dateA - dateB;
    });
  });

  // Store the subscription so we can unsubscribe later
  private destroy$ = new Subject<void>();

  constructor(
    private classesService: ClassesService,
    private dialogService: DialogService,
    private mobileService: MobileService,
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
  }

  ngOnInit(): void {
    // Load initial data
    this.usersService.loadUserDatas();
    this.classesService.loadClasses();

    // Subscribe to search input changes and update the searchInput signal
    this.searchForm.get('search')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchInput.set(value || '');
      });

    // Track swipe gestures to close the drawer
    this.initSwipeListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectUser(user: UserData): void {
    this.selectedUser.set(user);
    this.populateDisplayForm(user);
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

  // Handle editing the membership points
  toggleMembershipEdit(): void {
    this.isMembershipEditing.set(!this.isMembershipEditing());

    // Enable or disable the status field based on editing state
    const membershipControl = this.displayForm.get('membership');
    if (membershipControl) {
      if (this.isMembershipEditing()) {
        // Enable the membership field for editing
        membershipControl.enable();
      } else {
        // Disable the membership field after editing
        membershipControl.disable();

        // Retrieve the updated value from the form
        const updatedMembership = this.displayForm.get('membership')?.value;

        // Update the selectedUser's membership points
        const currentUser = this.selectedUser();
        if (currentUser) {
          const updatedUser: UserData = {
            ...currentUser,
            membership: updatedMembership
          };
          this.usersService.updateUserData(updatedUser)
        }
      }
    }
  }

  // Method to delete a class forever
  deleteClass(cls: Class): void {
    this.dialogService.openCancelClassDialog(cls);
  }

  // Method to edit the class status
  editClass(cls: Class): void {
    this.dialogService.openEditClassDialog(cls);
  }

  // Method to open the drawer and select a user
  openDrawer(user: UserData): void {
    this.selectUser(user);
    this.swipeDrawerTrackingEnabled = true;
    this.drawer.open();
  }

  // Optionally, close the drawer when needed
  closeDrawer(): void {
    this.drawer.close();
  }

  // Methods to handle table interaction events
  onTableInteractionStart(): void {
    this.mobileService.disableSwipeTracking();
  }

  onTableInteractionEnd(): void {
    this.mobileService.enableSwipeTracking();
  }

  // Methods to handle drawer interaction events
  onDrawerInteractionStart(): void {
    this.mobileService.disableSwipeTracking();
  }

  onDrawerInteractionEnd(): void {
    this.mobileService.enableSwipeTracking();
  }

  private initSwipeListeners(): void {
    window.addEventListener('touchstart', (event) => {
      if (!this.swipeDrawerTrackingEnabled) return;
      this.touchStartX = event.changedTouches[0].screenX;
      this.touchStartY = event.changedTouches[0].screenY;
    });

    window.addEventListener('touchend', (event) => {
      if (!this.swipeDrawerTrackingEnabled) return;
      this.touchEndX = event.changedTouches[0].screenX;
      this.touchEndY = event.changedTouches[0].screenY;
      this.handleSwipeGesture();
    });
  }

  private handleSwipeGesture(): void {
    // Calculate absolute X-axis and Y-axis distances
    const swipeDistanceX = this.touchEndX - this.touchStartX;
    const swipeDistanceY = Math.abs(this.touchEndY - this.touchStartY);

    // If the Y-axis movement is greater than maxSwipeDeltaY, it's not a valid horizontal swipe
    if (swipeDistanceY > this.maxSwipeDeltaY) {
      return;
    }

    if (swipeDistanceX > this.minSwipeDeltaX) {
      this.closeDrawer();
    }
  }

  getTelegramLink(username: string | undefined): string | null {
    // Check if the username is undefined, empty, or contains any spaces
    if (!username || username.trim() === '' || username.includes(' ')) {
      return null;
    }

    // Trim the '@' symbol if it exists at the beginning
    const trimmedUsername = username.startsWith('@') ? username.slice(1) : username;

    // Construct and return the Telegram link
    return `https://t.me/${trimmedUsername}`;
  }

}