import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersFirebaseService {

  firestore = inject(Firestore);

  usersCollection = collection(this.firestore, 'users');

  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
  }

}
