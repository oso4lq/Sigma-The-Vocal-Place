import { inject, Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { collection, DocumentReference } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Class } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassesFirebaseService {

  firestore = inject(Firestore);
  classesCollection = collection(this.firestore, 'classes');

  // Get the list of classes from Firebase
  getClasses(): Observable<Class[]> {
    return collectionData(this.classesCollection, {
      idField: 'id',
    }) as Observable<Class[]>;
  }

  // Add a new class to Firebase and return the document reference
  addClass(newClass: Class): Promise<DocumentReference> {
    return addDoc(this.classesCollection, newClass);
  }

  // Update an existing class in Firebase
  updateClass(updatedClass: Class): Promise<void> {
    const classDoc = doc(this.firestore, `classes/${updatedClass.id}`);
    return updateDoc(classDoc, { ...updatedClass });
  }

  // Delete a class from Firebase
  deleteClass(classId: string | number): Promise<void> {
    const classDoc = doc(this.firestore, `classes/${classId}`);
    return deleteDoc(classDoc);
  }

}