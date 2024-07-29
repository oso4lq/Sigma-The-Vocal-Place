import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    // { path: 'about', component: AboutComponent },
    // { path: 'services', component: ServicesComponent },
    // { path: 'contact', component: ContactsComponent },
    { path: '**', redirectTo: '' } // redirect to home for unknown paths
];
