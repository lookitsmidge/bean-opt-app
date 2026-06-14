import { InjectionToken } from '@angular/core';
import { ICoffeeMachineRepository } from './coffee-machine-repository.interface';
import { ICoffeeGrinderRepository } from './coffee-grinder-repository.interface';
import { ISetupRepository } from './setup-repository.interface';
import { IWorkflowRepository } from './workflow-repository.interface';
import { ICoffeeEquipmentRepository } from './coffee-equipment-repository.interface';

export const COFFEE_MACHINE_REPOSITORY_TOKEN = new InjectionToken<ICoffeeMachineRepository>(
  'JAMESMARTLAND_DDD_CORE_COFFEE_MACHINE_REPOSITORY_TOKEN'
);

export const COFFEE_GRINDER_REPOSITORY_TOKEN = new InjectionToken<ICoffeeGrinderRepository>(
  'JAMESMARTLAND_DDD_CORE_COFFEE_GRINDER_REPOSITORY_TOKEN'
);

export const SETUP_REPOSITORY_TOKEN = new InjectionToken<ISetupRepository>(
  'JAMESMARTLAND_DDD_CORE_SETUP_REPOSITORY_TOKEN'
);

export const WORKFLOW_REPOSITORY_TOKEN = new InjectionToken<IWorkflowRepository>(
  'JAMESMARTLAND_DDD_CORE_WORKFLOW_REPOSITORY_TOKEN'
);

export const COFFEE_EQUIPMENT_REPOSITORY_TOKEN = new InjectionToken<ICoffeeEquipmentRepository>(
  'JAMESMARTLAND_DDD_CORE_COFFEE_EQUIPMENT_REPOSITORY_TOKEN'
);
