import { TestBed } from '@angular/core/testing';
import { SetupStore } from './setup.store';
import { SETUP_REPOSITORY_TOKEN, SetupRepositoryMock, Setup } from '@boa/features/equipment/domain';
import { of, throwError } from 'rxjs';

describe('SetupStore', () => {
  let store: any;
  let repoMock: SetupRepositoryMock;

  const mockSetup: Setup = {
    id: 'setup-1',
    userId: 'user-1',
    name: 'Home Setup',
    machineId: 'machine-1',
    grinderId: 'grinder-1',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    repoMock = new SetupRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        SetupStore,
        { provide: SETUP_REPOSITORY_TOKEN, useValue: repoMock },
      ],
    });

    store = TestBed.inject(SetupStore);
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load setups successfully', () => {
    repoMock.getSetups.mockReturnValue(of([mockSetup]));

    store.loadSetups('user-1');

    expect(repoMock.getSetups).toHaveBeenCalledWith('user-1');
    expect(store.items()).toEqual([mockSetup]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle load error', () => {
    repoMock.getSetups.mockReturnValue(throwError(() => new Error('Failed to load')));

    store.loadSetups('user-1');

    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Failed to load');
  });

  it('should add setup successfully', async () => {
    repoMock.saveSetup.mockResolvedValue(undefined);

    await store.addSetup(mockSetup);

    expect(repoMock.saveSetup).toHaveBeenCalledWith(mockSetup);
    expect(store.items()).toEqual([mockSetup]);
    expect(store.loading()).toBe(false);
  });

  it('should delete setup successfully', async () => {
    repoMock.saveSetup.mockResolvedValue(undefined);
    repoMock.deleteSetup.mockResolvedValue(undefined);

    await store.addSetup(mockSetup);
    expect(store.items()).toEqual([mockSetup]);

    await store.deleteSetup(mockSetup.id);

    expect(repoMock.deleteSetup).toHaveBeenCalledWith(mockSetup.id);
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
  });
});
