import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { from, Observable, Subscription } from 'rxjs';
import { User } from '../interfaces/data.interface';
import { UsersFirebaseService } from './users-firebase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<any | null | undefined>(undefined);  // Stores the user from Auth
  currentUserDataSig = signal<User | null>(null);  // Stores the user data from Firestore
  private userDataSubscription: Subscription | null = null;  // Store the subscription to user data

  constructor(
    private usersFirebaseService: UsersFirebaseService,
    private router: Router,
  ) {
    this.monitorAuthState();
  }

  // Monitor Firebase Authentication state
  monitorAuthState(): void {
    onAuthStateChanged(this.firebaseAuth, (firebaseUser) => {

      // If authenticated user found, set user and userData
      if (firebaseUser) {
        // console.log('onAuthStateChanged setting firebaseUser', firebaseUser);
        this.currentUserSig.set(firebaseUser);

        if (firebaseUser.uid) {
          // console.log('setting firebaseUserData for uid: ', firebaseUser.uid);

          // Unsubscribe from any previous subscription
          if (this.userDataSubscription) {
            this.userDataSubscription.unsubscribe();
          }

          // Subscribe to getUserById for the current user
          this.userDataSubscription = this.usersFirebaseService.getUserById(firebaseUser.uid).subscribe(userData => {
            this.currentUserDataSig.set(userData);
            console.log('User data fetched: ', this.currentUserDataSig());
          });
        }
        // If no authenticated user, set to null user and userData
      } else {
        this.setUserDataNull();
      }
    });
  }

  setUserDataNull() {
    // console.log('user setting null');
    this.currentUserSig.set(null);
    // console.log('userData setting null');
    this.currentUserDataSig.set(null);

    // Unsubscribe from the Firestore user data subscription
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
      this.userDataSubscription = null;  // Reset the subscription
    }
  }

  register(email: string, name: string, password: string): Observable<void> {
    console.log('register user');
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response =>
        updateProfile(response.user, { displayName: name })
      );

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    // console.log('log in user');
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(() => { })

    return from(promise);
  }

  logout(): Observable<void> {
    // console.log('log out user');
    const promise = signOut(this.firebaseAuth).then(() => {
      this.setUserDataNull();
      this.router.navigate(['/']);
    });

    return from(promise);
  }
}
