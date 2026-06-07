import {
  ApplicationConfig,
  EnvironmentProviders,
  provideBrowserGlobalErrorListeners,
  Provider,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import { appRoutes } from './app.routes';
import { APP_CONFIG } from '@boa/infra-util';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { AUTH_REPOSITORY_TOKEN, PROFILE_REPOSITORY_TOKEN } from '@boa/core-auth-domain';
import { SupabaseAuthRepository, SupabaseProfileRepository } from '@boa/core-auth-data-access';
import { ESPRESSO_READING_REPOSITORY_TOKEN } from '@boa/features/readings/domain';
import { SupabaseEspressoReadingRepository } from '@boa/features/readings/data-access';
import { COFFEE_REPOSITORY_TOKEN } from '@boa/features/coffees/domain';
import { SupabaseCoffeeRepository } from '@boa/features/coffees/data-access';
import {
  COFFEE_MACHINE_REPOSITORY_TOKEN,
  COFFEE_GRINDER_REPOSITORY_TOKEN,
  SETUP_REPOSITORY_TOKEN,
  WORKFLOW_REPOSITORY_TOKEN,
  COFFEE_EQUIPMENT_REPOSITORY_TOKEN,
} from '@boa/features/equipment/domain';
import {
  SupabaseCoffeeGrinderRepository,
  SupabaseCoffeeMachineRepository,
  SupabaseSetupRepository,
  SupabaseWorkflowRepository,
  SupabaseCoffeeEquipmentRepository,
} from '@boa/features/equipment/data-access';

const serviceProviders: (Provider | EnvironmentProviders)[] = [
  { provide: AUTH_REPOSITORY_TOKEN, useClass: SupabaseAuthRepository },
  { provide: PROFILE_REPOSITORY_TOKEN, useClass: SupabaseProfileRepository },
  { provide: ESPRESSO_READING_REPOSITORY_TOKEN, useClass: SupabaseEspressoReadingRepository },
  { provide: COFFEE_REPOSITORY_TOKEN, useClass: SupabaseCoffeeRepository },
  { provide: COFFEE_MACHINE_REPOSITORY_TOKEN, useClass: SupabaseCoffeeMachineRepository },
  { provide: COFFEE_GRINDER_REPOSITORY_TOKEN, useClass: SupabaseCoffeeGrinderRepository },
  { provide: SETUP_REPOSITORY_TOKEN, useClass: SupabaseSetupRepository },
  { provide: WORKFLOW_REPOSITORY_TOKEN, useClass: SupabaseWorkflowRepository },
  { provide: COFFEE_EQUIPMENT_REPOSITORY_TOKEN, useClass: SupabaseCoffeeEquipmentRepository },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideAnimationsAsync(),
    /** Application Configuration Environment Variables */
    { provide: APP_CONFIG, useValue: environment },
    provideRouter(appRoutes),

    provideHttpClient(),

    /** Default Icon Options */
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },

    serviceProviders,
  ],
};
