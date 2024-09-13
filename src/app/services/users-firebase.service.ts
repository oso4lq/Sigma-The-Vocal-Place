import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersFirebaseService {

  firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'users');

  // Get the list of users from Firebase
  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
  }

  // Get a specific user by userId
  getUserById(userId: string | number): Observable<User> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return docData(userDoc, { idField: 'id' }) as Observable<User>;
  }

  // Add a new user to Firebase
  addUser(newUser: User): Promise<void> {
    return addDoc(this.usersCollection, newUser).then(() => { });
  }

  // Update an existing user in Firebase
  updateUser(updatedUser: User): Promise<void> {
    const userDoc = doc(this.firestore, `users/${updatedUser.id}`);
    return updateDoc(userDoc, { ...updatedUser });
  }

  // Delete a user from Firebase
  deleteUser(userId: string | number): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return deleteDoc(userDoc);
  }

}