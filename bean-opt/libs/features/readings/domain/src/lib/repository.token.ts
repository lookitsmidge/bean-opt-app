import { InjectionToken } from '@angular/core';
import { IEspressoReadingRepository } from './espresso-reading-repository.interface';

export const ESPRESSO_READING_REPOSITORY_TOKEN =
  new InjectionToken<IEspressoReadingRepository>('JAMESMARTLAND_DDD_CORE_ESPRESSO_READING_REPOSITORY_TOKEN');
