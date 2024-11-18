import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment.development';

// Inicializar Firebase
initializeApp(environment.firebaseConf);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
