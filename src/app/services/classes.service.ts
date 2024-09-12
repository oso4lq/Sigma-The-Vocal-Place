import { Injectable, signal } from '@angular/core';
import { Class } from '../interfaces/data.interface';
import { ClassesFirebaseService } from './classes-firebase.service';

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
      console.log('Subscribed to the classes signal');
      console.log('classes ', classes);
      this.classesSig.set(classes);
    })
  }

  // Add a new class (local and to Firebase)
  addClass(newClass: Class): void {
    console.log('addClass', newClass);
    this.classesFirebaseService.addClass(newClass).then(() => {
      this.classesSig.update((classes) => [...classes, newClass]);
    });
  }

  // Update a class (local and to Firebase)
  updateClass(updatedClass: Class): void {
    console.log('updateClass', updatedClass);
    this.classesFirebaseService.updateClass(updatedClass).then(() => {
      this.classesSig.update((classes) =>
        classes.map((cls) => (cls.id === updatedClass.id ? updatedClass : cls))
      );
    });
  }

  // Delete a class (local and from Firebase)
  deleteClass(classId: string | number): void {
    console.log('deleteClass', classId);
    this.classesFirebaseService.deleteClass(classId).then(() => {
      this.classesSig.update((classes) => classes.filter((cls) => cls.id !== classId));
    });
  }
}