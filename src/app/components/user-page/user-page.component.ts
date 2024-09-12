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
import { ClassesFirebaseService } from '../../services/classes-firebase.service';
import { ClassesService } from '../../services/classes.service';
import { AuthService } from '../../services/auth.service';

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
  // classes: Class[] = [];

  // default user image
  imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  mockingAdmin: User = {
    id: 0,
    isadmin: true,
    name: "Osmium Tetroxide",
    img: "https://res.cloudinary.com/dxunxtt1u/image/upload/kotvochkakh_ue5xir.jpg",
    email: "",
    telegram: "@osmium_tetroxide",
    phone: "+12345",
    seaspass: 1,
    classes: [],
  };

  mockingUser: User = {
    id: 1,
    isadmin: false,
    name: "John Doe",
    img: "",
    email: "john.doe@mail.mail",
    telegram: "",
    phone: "",
    seaspass: 0,
    classes: [],
  }

  user = this.mockingAdmin;

  constructor(
    private classesService: ClassesService,
    private authService: AuthService,
    private parent: AppComponent,
    // private classesFirebaseService: ClassesFirebaseService,
  ) { }

  currentUser: any = computed(() => this.authService.currentUserSig()); // track the current user
  classes: any = computed(() => this.classesService.classesSig()); // track the classes array

  ngOnInit(): void {
    this.classesService.loadClasses();
  }

  refreshClasses() {
    // Optionally reload classes from Firebase
    console.log("Refreshing classes...");
    this.classesService.loadClasses();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Mock sending data to the server
      console.log("Sending updated details to the server:", this.user);
    }
  }

  editClass() {
    console.log('Editing class will be ready soon');
  }

  logout() {
    // console.log("logout will be ready soon");
    console.log('log out user on user page');
    this.authService.logout();
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
