import { Injectable, signal } from '@angular/core';
import { Request } from '../interfaces/data.interface';
import { RequestsFirebaseService } from './requests-firebase.service';
import { DocumentReference } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  // Signal to hold the Requests list
  requestsSig = signal<Request[]>([]);

  constructor(
    private requestsFirebaseService: RequestsFirebaseService,
  ) { }

  // Fetch the Requests from Firebase and set them in the signal
  loadRequests(): void {
    this.requestsFirebaseService.getRequests().subscribe((requests: Request[]) => {
      console.log('load requests ', requests);
      this.requestsSig.set(requests);
    })
  }

  // Add a new Request, update the signal, and return the document reference with the auto-generated ID
  addRequest(newRequest: Request): Promise<DocumentReference> {
    console.log('add Request', newRequest);
    return this.requestsFirebaseService.addRequest(newRequest).then((docRef) => {
      // Set the generated ID in the newRequest object
      newRequest.id = docRef.id;

      // Update the Requests signal
      this.requestsSig.update((requests) => [...requests, newRequest]);

      // Return the document reference
      return docRef;
    });
  }

  // Update a Request (local and to Firebase)
  updateRequest(updatedRequest: Request): void {
    console.log('update request', updatedRequest);
    this.requestsFirebaseService.updateRequest(updatedRequest).then(() => {
      this.requestsSig.update((requests) =>
        requests.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
      );
    });
  }

  // Delete a Request (local and from Firebase)
  deleteRequest(requestId: string | number): void {
    console.log('delete request', requestId);
    this.requestsFirebaseService.deleteRequest(requestId).then(() => {
      this.requestsSig.update((requests) => requests.filter((req) => req.id !== requestId));
    });
  }
  
}