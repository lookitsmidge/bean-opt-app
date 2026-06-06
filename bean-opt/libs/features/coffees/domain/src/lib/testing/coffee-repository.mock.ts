import { vi } from 'vitest';
import { of } from 'rxjs';
import { ICoffeeRepository } from '../coffee-repository.interface';

export class CoffeeRepositoryMock implements ICoffeeRepository {
  getCoffees = vi.fn().mockReturnValue(of([]));
  getCoffeeById = vi.fn().mockReturnValue(of(null));
  saveCoffee = vi.fn().mockReturnValue(Promise.resolve());
  deleteCoffee = vi.fn().mockReturnValue(Promise.resolve());
}

export const createCoffeeRepositoryMock = () => new CoffeeRepositoryMock();
