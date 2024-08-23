import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    // { path: 'about', component: AboutComponent },
    { path: '**', redirectTo: '' } // redirect to home for unknown paths
];
