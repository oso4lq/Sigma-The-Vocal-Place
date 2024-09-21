import { Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { MainComponent } from './components/main/main.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    // { path: 'user', component: UserPageComponent },
    {
        path: 'user',
        component: UserPageComponent,
        canActivate: [AuthGuard],
    },
    { path: '**', redirectTo: '' }
];