import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/data.interface';
import { UsersFirebaseService } from './users-firebase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUserDataSig = signal<User | null>(null);  // Stores the user data from Firestore

  constructor(
    private usersFirebaseService: UsersFirebaseService,
    private authService: AuthService,
  ) {
    // // Subscribe to authentication status and fetch user data if logged in
    // this.authService.currentUserSig()?.subscribe((firebaseUser: any) => {
    //   if (firebaseUser) {
    //     console.log('set firebaseUserData', firebaseUser);
    //     this.fetchUserData();
    //     console.log(this.authService.currentUserSig());
    //   } else {
    //     console.log('nulled userData');
    //     this.currentUserDataSig.set(null);
    //   }
    // });
  }

  // Subscribe to authentication status and fetch user data if logged in
  subscribeToUserData(): void {
    this.authService.currentUserSig()?.subscribe((firebaseUser: any) => {
      if (firebaseUser) {
        console.log('set firebaseUserData', firebaseUser);
        this.fetchUserData();
        console.log(this.authService.currentUserDataSig());
      } else {
        console.log('nulled userData');
        this.currentUserDataSig.set(null);
      }
    });
  };

  // Fetch user data using the UID from Firebase Auth
  fetchUserData(): void {
    const firebaseUser = this.authService.firebaseAuth.currentUser;
    if (firebaseUser?.uid) {
      this.usersFirebaseService.getUserById(firebaseUser.uid).subscribe(userData => {
        this.currentUserDataSig.set(userData);
      });
    }
  }

  // Get the current user data as a signal
  getUserData() {
    return this.currentUserDataSig();
  }
}