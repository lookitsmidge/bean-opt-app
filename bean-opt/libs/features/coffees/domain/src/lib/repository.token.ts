import { InjectionToken } from '@angular/core';
import { ICoffeeRepository } from './coffee-repository.interface';

export const COFFEE_REPOSITORY_TOKEN = new InjectionToken<ICoffeeRepository>(
  'JAMESMARTLAND_DDD_CORE_COFFEE_REPOSITORY_TOKEN'
);
