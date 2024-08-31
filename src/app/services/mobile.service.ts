import { Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  private isMobileSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(window.innerWidth <= 768);
  isMobile$ = this.isMobileSubject.asObservable();

  swipeLeft$ = new BehaviorSubject<boolean>(false);
  swipeRight$ = new BehaviorSubject<boolean>(false);

  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private swipeTrackingEnabled: boolean = true;

  constructor() {
    fromEvent(window, 'resize').subscribe(() => {
      this.isMobileSubject.next(window.innerWidth <= 768);
    });

    this.initSwipeListeners();
  }

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }

  disableSwipeTracking(): void {
    console.log('disableSwipeTracking');
    this.swipeTrackingEnabled = false;
  }

  enableSwipeTracking(): void {
    console.log('enableSwipeTracking');
    this.swipeTrackingEnabled = true;
  }

  private initSwipeListeners(): void {
    window.addEventListener('touchstart', (event) => {
      if (!this.swipeTrackingEnabled) return;
      this.touchStartX = event.changedTouches[0].screenX;
    });

    window.addEventListener('touchend', (event) => {
      if (!this.swipeTrackingEnabled) return;
      this.touchEndX = event.changedTouches[0].screenX;
      this.handleSwipeGesture();
    });
  }

  private handleSwipeGesture(): void {
    const swipeDistance = this.touchEndX - this.touchStartX;
    console.log('handleSwipeGesture, ', swipeDistance);
    if (swipeDistance < -50) {
      this.swipeLeft$.next(true);
    } else if (swipeDistance > 50) {
      this.swipeRight$.next(true);
    }
  }
}
