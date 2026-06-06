import { TestBed } from '@angular/core/testing';
import { CoffeeGrinderStore } from './coffee-grinder.store';
import { COFFEE_GRINDER_REPOSITORY_TOKEN, CoffeeGrinderRepositoryMock, CoffeeGrinder } from '@boa/features/equipment/domain';
import { of, throwError } from 'rxjs';

describe('CoffeeGrinderStore', () => {
  let store: any;
  let repoMock: CoffeeGrinderRepositoryMock;

  const mockGrinder: CoffeeGrinder = {
    id: 'grinder-1',
    userId: 'user-1',
    name: 'Niche Zero',
    manufacturer: 'Niche',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    repoMock = new CoffeeGrinderRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        CoffeeGrinderStore,
        { provide: COFFEE_GRINDER_REPOSITORY_TOKEN, useValue: repoMock },
      ],
    });

    store = TestBed.inject(CoffeeGrinderStore);
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load grinders successfully', () => {
    repoMock.getGrinders.mockReturnValue(of([mockGrinder]));

    store.loadGrinders('user-1');

    expect(repoMock.getGrinders).toHaveBeenCalledWith('user-1');
    expect(store.items()).toEqual([mockGrinder]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle load error', () => {
    repoMock.getGrinders.mockReturnValue(throwError(() => new Error('Failed to load')));

    store.loadGrinders('user-1');

    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Failed to load');
  });

  it('should add grinder successfully', async () => {
    repoMock.saveGrinder.mockResolvedValue(undefined);

    await store.addGrinder(mockGrinder);

    expect(repoMock.saveGrinder).toHaveBeenCalledWith(mockGrinder);
    expect(store.items()).toEqual([mockGrinder]);
    expect(store.loading()).toBe(false);
  });

  it('should delete grinder successfully', async () => {
    repoMock.saveGrinder.mockResolvedValue(undefined);
    repoMock.deleteGrinder.mockResolvedValue(undefined);

    await store.addGrinder(mockGrinder);
    expect(store.items()).toEqual([mockGrinder]);

    await store.deleteGrinder(mockGrinder.id);

    expect(repoMock.deleteGrinder).toHaveBeenCalledWith(mockGrinder.id);
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
  });
});
