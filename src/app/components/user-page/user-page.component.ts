import { Component } from '@angular/core';
import { User } from '../../interfaces/data.interface';
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
export class UserPageComponent {

  isEditing = false; // Track whether inputs are editable

  // default user image
  imgDefault = "https://res.cloudinary.com/dxunxtt1u/image/upload/userAvatarPlaceholder_ox0tj4.png";

  mockingAdmin: User = {
    id: 0,
    isadmin: true,
    name: "Osmium Tetroxide",
    img: "https://res.cloudinary.com/dxunxtt1u/image/upload/kotvochkakh_ue5xir.jpg",
    mail: "",
    telegram: "@osmium_tetroxide",
    phone: "+12345",
    seaspass: 4,
    classes: [],
  };

  mockingUser: User = {
    id: 1,
    isadmin: false,
    name: "John Doe",
    img: "",
    mail: "john.doe@mail.mail",
    telegram: "",
    phone: "",
    seaspass: 0,
    classes: [],
  }

  user = this.mockingAdmin;

  constructor(
    private parent: AppComponent,
  ) { }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Mock sending data to the server
      console.log("Sending updated details to the server:", this.user);
    }
  }

  openForm() {
    this.parent.openForm();
  }

  refreshClasses() {
    // Placeholder logic for refreshing classes
    console.log("Refreshing classes...");
  }
}
