import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { newUserRequest } from '../interfaces/data.interface';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RequestsFirebaseService {

  firestore = inject(Firestore);
  requestCollection = collection(this.firestore, 'requests');

  // Get the list of Requests from Firebase
  getRequests(): Observable<newUserRequest[]> {
    return collectionData(this.requestCollection, {
      idField: 'id',
    }) as Observable<newUserRequest[]>;
  }

  // Add a new Request to Firebase and return the document reference
  addRequest(newRequest: newUserRequest): Promise<DocumentReference> {
    return addDoc(this.requestCollection, newRequest);
  }

  // Update an existing Request in Firebase
  updateRequest(updatedRequest: newUserRequest): Promise<void> {
    const requestDoc = doc(this.firestore, `requests/${updatedRequest.id}`);
    return updateDoc(requestDoc, { ...updatedRequest });
  }

  // Delete a Request from Firebase
  deleteRequest(requestToDelete: newUserRequest): Promise<void> {
    const requestDoc = doc(this.firestore, `requests/${requestToDelete.id}`);
    return deleteDoc(requestDoc);
  }

}