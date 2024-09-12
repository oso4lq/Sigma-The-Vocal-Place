import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { User } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<any | null | undefined>(undefined);

  constructor() {
    // Monitor Firebase user state changes
    this.user$.subscribe((firebaseUser: any) => {
      if (firebaseUser) {
        this.currentUserSig.set(firebaseUser);
      } else {
        this.currentUserSig.set(null); // Set null if not authenticated
      }
    });
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
    console.log('log in user');
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(() => { })

    return from(promise);
  }

  logout(): Observable<void> {
    console.log('log out user');
    const promise = signOut(this.firebaseAuth);

    return from(promise);
  }
}
