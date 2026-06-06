import { InjectionToken } from '@angular/core';
import { ICoffeeRepository } from './coffee-repository.interface';

export const COFFEE_REPOSITORY_TOKEN = new InjectionToken<ICoffeeRepository>(
  'COFFEE_REPOSITORY_TOKEN'
);
