import { Component, computed, OnInit } from '@angular/core';
import { Class, User } from '../../interfaces/data.interface';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AdminConsoleComponent } from '../admin-console/admin-console.component';
import { ClassesService } from '../../services/classes.service';
import { AuthService } from '../../services/auth.service';
import { UsersFirebaseService } from '../../services/users-firebase.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

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
    AdminConsoleComponent,
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  isEditing = false; // Track whether inputs are editable
  userData: User | null = null; // Store the fetched user data
  imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  constructor(
    private classesService: ClassesService,
    private authService: AuthService,
    private parent: AppComponent,
    private router: Router,
  ) { }

  currentUser: any = computed(() => this.authService.currentUserSig()); // track the current user
  currentUserData: any = computed(() => this.authService.currentUserDataSig()); // track the current user data
  classes: any = computed(() => this.classesService.classesSig()); // track the classes array

  ngOnInit(): void {
    this.classesService.loadClasses();
    this.userData = this.currentUserData();
    console.log(this.userData);
  }

  refreshClasses() {
    console.log("Refreshing classes...");
    this.classesService.loadClasses();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Mock sending data to the server
      console.log("Sending updated details to the server:", this.userData);
    }
  }

  editClass() {
    console.log('Editing class will be ready soon');
  }

  logout() {
    console.log('log out user on user page');
    this.authService.logout();
    // this.router.navigate(['/']);
  }

  openForm() {
    this.parent.openForm();
  }

  getSeasonPassText(seaspass: number): string {
    if (seaspass === 1) return `осталось ${seaspass} занятие`;
    if (seaspass > 1 && seaspass < 5) return `осталось ${seaspass} занятия`;
    if (seaspass >= 5) return `осталось ${seaspass} занятий`;
    return `Чтобы приобрести абонемент, свяжитесь с преподавателем.`;
  }
}
