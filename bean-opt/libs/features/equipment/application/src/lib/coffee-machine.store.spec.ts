import { TestBed } from '@angular/core/testing';
import { CoffeeMachineStore } from './coffee-machine.store';
import { COFFEE_MACHINE_REPOSITORY_TOKEN, CoffeeMachineRepositoryMock, CoffeeMachine } from '@boa/features/equipment/domain';
import { of, throwError } from 'rxjs';

describe('CoffeeMachineStore', () => {
  let store: any;
  let repoMock: CoffeeMachineRepositoryMock;

  const mockMachine: CoffeeMachine = {
    id: 'machine-1',
    userId: 'user-1',
    name: 'Linea Micra',
    manufacturer: 'La Marzocco',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    repoMock = new CoffeeMachineRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        CoffeeMachineStore,
        { provide: COFFEE_MACHINE_REPOSITORY_TOKEN, useValue: repoMock },
      ],
    });

    store = TestBed.inject(CoffeeMachineStore);
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load machines successfully', () => {
    repoMock.getMachines.mockReturnValue(of([mockMachine]));

    store.loadMachines('user-1');

    expect(repoMock.getMachines).toHaveBeenCalledWith('user-1');
    expect(store.items()).toEqual([mockMachine]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle load error', () => {
    repoMock.getMachines.mockReturnValue(throwError(() => new Error('Failed to load')));

    store.loadMachines('user-1');

    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Failed to load');
  });

  it('should add machine successfully', async () => {
    repoMock.saveMachine.mockResolvedValue(undefined);

    await store.addMachine(mockMachine);

    expect(repoMock.saveMachine).toHaveBeenCalledWith(mockMachine);
    expect(store.items()).toEqual([mockMachine]);
    expect(store.loading()).toBe(false);
  });

  it('should delete machine successfully', async () => {
    repoMock.saveMachine.mockResolvedValue(undefined);
    repoMock.deleteMachine.mockResolvedValue(undefined);

    await store.addMachine(mockMachine);
    expect(store.items()).toEqual([mockMachine]);

    await store.deleteMachine(mockMachine.id);

    expect(repoMock.deleteMachine).toHaveBeenCalledWith(mockMachine.id);
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
  });
});
