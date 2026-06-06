import { InjectionToken } from '@angular/core';
import { ICoffeeMachineRepository } from './coffee-machine-repository.interface';
import { ICoffeeGrinderRepository } from './coffee-grinder-repository.interface';
import { ISetupRepository } from './setup-repository.interface';
import { IWorkflowRepository } from './workflow-repository.interface';

export const COFFEE_MACHINE_REPOSITORY_TOKEN = new InjectionToken<ICoffeeMachineRepository>(
  'COFFEE_MACHINE_REPOSITORY_TOKEN'
);

export const COFFEE_GRINDER_REPOSITORY_TOKEN = new InjectionToken<ICoffeeGrinderRepository>(
  'COFFEE_GRINDER_REPOSITORY_TOKEN'
);

export const SETUP_REPOSITORY_TOKEN = new InjectionToken<ISetupRepository>(
  'SETUP_REPOSITORY_TOKEN'
);

export const WORKFLOW_REPOSITORY_TOKEN = new InjectionToken<IWorkflowRepository>(
  'WORKFLOW_REPOSITORY_TOKEN'
);
