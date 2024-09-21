import { Injectable, signal } from '@angular/core';
import { Class } from '../interfaces/data.interface';
import { ClassesFirebaseService } from './classes-firebase.service';
import { DocumentReference } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  // Signal to hold the classes list
  classesSig = signal<Class[]>([]);

  constructor(
    private classesFirebaseService: ClassesFirebaseService,
  ) { }

  // Fetch the classes from Firebase and set them in the signal
  loadClasses(): void {
    this.classesFirebaseService.getClasses().subscribe((classes: Class[]) => {
      // console.log('loadClasses ', classes);
      this.classesSig.set(classes);
    })
  }

  // Add a new class, update the signal, and return the document reference with the auto-generated ID
  addClass(newClass: Class): Promise<DocumentReference> {
    // console.log('addClass', newClass);
    return this.classesFirebaseService.addClass(newClass).then((docRef) => {
      // Set the generated ID in the newClass object
      newClass.id = docRef.id;

      // Update the classes signal
      this.classesSig.update((classes) => [...classes, newClass]);

      // Return the document reference
      return docRef;
    });
  }

  // Update a class (local and to Firebase)
  updateClass(updatedClass: Class): void {
    // console.log('updateClass', updatedClass);
    this.classesFirebaseService.updateClass(updatedClass).then(() => {
      this.classesSig.update((classes) =>
        classes.map((cls) => (cls.id === updatedClass.id ? updatedClass : cls))
      );
    });
  }

  // Delete a class (local and from Firebase)
  deleteClass(classId: string | number): void {
    // console.log('deleteClass', classId);
    this.classesFirebaseService.deleteClass(classId).then(() => {
      this.classesSig.update((classes) => classes.filter((cls) => cls.id !== classId));
    });
  }
  
}