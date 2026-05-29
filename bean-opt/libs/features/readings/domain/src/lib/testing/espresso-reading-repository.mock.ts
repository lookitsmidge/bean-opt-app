import { vi } from 'vitest';
import { of } from 'rxjs';
import { IEspressoReadingRepository } from '../espresso-reading-repository.interface';

export class EspressoReadingRepositoryMock implements IEspressoReadingRepository {
  getReadings = vi.fn().mockReturnValue(of([]));
  getReadingById = vi.fn().mockReturnValue(of(null));
  saveReading = vi.fn().mockReturnValue(Promise.resolve());
  deleteReading = vi.fn().mockReturnValue(Promise.resolve());
}
export const createEspressoReadingRepositoryMock = () => new EspressoReadingRepositoryMock();
