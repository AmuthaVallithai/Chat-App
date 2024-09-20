import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS }  from  '@angular/fire/compat'

import { MatFormFieldModule} from '@angular/material/form-field'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AuthGuard, AuthGuardModule } from '@angular/fire/auth-guard';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { ProfileComponent } from './profile/profile/profile.component';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), 
    provideFunctions(() => getFunctions()), 
    provideStorage(() => getStorage()),
   
    {provide: FIREBASE_OPTIONS,
      useValue:environment.firebase},
    provideAnimations(),
    AuthGuard, AuthGuardModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ProfileComponent,
    DatePipe
  ]
};
