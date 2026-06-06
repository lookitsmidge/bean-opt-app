import { TestBed } from '@angular/core/testing';
import { CoffeeStore } from './coffee.store';
import { COFFEE_REPOSITORY_TOKEN, CoffeeRepositoryMock, Coffee } from '@boa/features/coffees/domain';
import { of, throwError } from 'rxjs';

describe('CoffeeStore', () => {
  let store: any;
  let repoMock: CoffeeRepositoryMock;

  const mockCoffee: Coffee = {
    id: 'coffee-1',
    userId: 'user-1',
    name: 'Ethiopia Yirgacheffe',
    roaster: 'Origin',
    roastProfile: 'medium',
    description: 'Floral, blueberry roast notes',
    url: 'http://example.com',
    pricePerKg: 24.50,
    notes: 'Floral, blueberry',
    active: true,
    createdAt: new Date().toISOString(),
    targets: [],
  };

  beforeEach(() => {
    repoMock = new CoffeeRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        CoffeeStore,
        { provide: COFFEE_REPOSITORY_TOKEN, useValue: repoMock },
      ],
    });

    store = TestBed.inject(CoffeeStore);
  });

  it('should initialize with empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load coffees successfully', () => {
    repoMock.getCoffees.mockReturnValue(of([mockCoffee]));

    store.loadCoffees('user-1');

    expect(repoMock.getCoffees).toHaveBeenCalledWith('user-1');
    expect(store.items()).toEqual([mockCoffee]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle load error', () => {
    repoMock.getCoffees.mockReturnValue(throwError(() => new Error('Failed to load')));

    store.loadCoffees('user-1');

    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Failed to load');
  });

  it('should add coffee successfully', async () => {
    repoMock.saveCoffee.mockResolvedValue(undefined);

    await store.addCoffee(mockCoffee);

    expect(repoMock.saveCoffee).toHaveBeenCalledWith(mockCoffee);
    expect(store.items()).toEqual([mockCoffee]);
    expect(store.loading()).toBe(false);
  });

  it('should delete coffee successfully', async () => {
    repoMock.saveCoffee.mockResolvedValue(undefined);
    repoMock.deleteCoffee.mockResolvedValue(undefined);

    // Seed state first
    await store.addCoffee(mockCoffee);
    expect(store.items()).toEqual([mockCoffee]);

    await store.deleteCoffee(mockCoffee.id);

    expect(repoMock.deleteCoffee).toHaveBeenCalledWith(mockCoffee.id);
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBe(false);
  });
});
