import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4rN8x2CzenHeVSvfNM_A7xl13xce1GRI",
  authDomain: "sigma-the-vocal-place.firebaseapp.com",
  projectId: "sigma-the-vocal-place",
  storageBucket: "sigma-the-vocal-place.appspot.com",
  messagingSenderId: "98097750547",
  appId: "1:98097750547:web:a9bfa2bff3979f302595e6",
  measurementId: "G-SP246NGJ35"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    // importProvidersFrom([
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    // ])
  ]
};
