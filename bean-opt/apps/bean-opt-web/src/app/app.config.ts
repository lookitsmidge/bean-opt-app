import {
  ApplicationConfig,
  EnvironmentProviders,
  provideBrowserGlobalErrorListeners,
  Provider,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { appRoutes } from './app.routes';
import { APP_CONFIG } from '@boa/infra-util';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';

const serviceProviders: (Provider | EnvironmentProviders)[] = [
  
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    /** Application Configuration Environment Variables */
    { provide: APP_CONFIG, useValue: environment },
    provideRouter(appRoutes),

    provideHttpClient(),

    /** Default Icon Options */
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },

    serviceProviders,
  ],
};
