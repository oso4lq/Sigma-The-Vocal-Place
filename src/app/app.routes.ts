import { ExtraOptions, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { MainComponent } from './components/main/main.component';
import { UserPageComponent } from './components/user-page/user-page.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'user', component: UserPageComponent },
    { path: '**', redirectTo: '' }
];

// Enable scroll restoration and scrolling to top on route change
export const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',  // Restores the scroll position on refresh
    anchorScrolling: 'enabled',  // Enables scrolling to an anchor (section) if available
};