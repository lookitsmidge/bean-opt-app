import { vi } from 'vitest';
import { of } from 'rxjs';
import { ICoffeeMachineRepository } from '../coffee-machine-repository.interface';
import { ICoffeeGrinderRepository } from '../coffee-grinder-repository.interface';
import { ISetupRepository } from '../setup-repository.interface';
import { IWorkflowRepository } from '../workflow-repository.interface';
import { ICoffeeEquipmentRepository } from '../coffee-equipment-repository.interface';

export class CoffeeMachineRepositoryMock implements ICoffeeMachineRepository {
  getMachines = vi.fn().mockReturnValue(of([]));
  getMachineById = vi.fn().mockReturnValue(of(null));
  saveMachine = vi.fn().mockReturnValue(Promise.resolve());
  deleteMachine = vi.fn().mockReturnValue(Promise.resolve());
}

export class CoffeeGrinderRepositoryMock implements ICoffeeGrinderRepository {
  getGrinders = vi.fn().mockReturnValue(of([]));
  getGrinderById = vi.fn().mockReturnValue(of(null));
  saveGrinder = vi.fn().mockReturnValue(Promise.resolve());
  deleteGrinder = vi.fn().mockReturnValue(Promise.resolve());
}

export class SetupRepositoryMock implements ISetupRepository {
  getSetups = vi.fn().mockReturnValue(of([]));
  getSetupById = vi.fn().mockReturnValue(of(null));
  saveSetup = vi.fn().mockReturnValue(Promise.resolve());
  deleteSetup = vi.fn().mockReturnValue(Promise.resolve());
}

export class WorkflowRepositoryMock implements IWorkflowRepository {
  getWorkflows = vi.fn().mockReturnValue(of([]));
  getWorkflowById = vi.fn().mockReturnValue(of(null));
  saveWorkflow = vi.fn().mockReturnValue(Promise.resolve());
  deleteWorkflow = vi.fn().mockReturnValue(Promise.resolve());
  saveWorkflowStep = vi.fn().mockReturnValue(Promise.resolve());
  deleteWorkflowStep = vi.fn().mockReturnValue(Promise.resolve());
}

export class CoffeeEquipmentRepositoryMock implements ICoffeeEquipmentRepository {
  getEquipments = vi.fn().mockReturnValue(of([]));
  getEquipmentById = vi.fn().mockReturnValue(of(null));
  saveEquipment = vi.fn().mockReturnValue(Promise.resolve());
  deleteEquipment = vi.fn().mockReturnValue(Promise.resolve());
}
