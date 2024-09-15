import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, Observable, take } from 'rxjs';
import { DialogService } from './services/dialog.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {
  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      take(1),
      map((user) => {
        if (user) {
          // User is authenticated
          return true;
        } else {
          // User is not authenticated, redirect to login
          this.router.navigate(['/']);
          this.dialogService.openLogin();
          return false;
        }
      })
    );
  }
}