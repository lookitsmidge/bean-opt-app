import { Subject } from 'rxjs';
import { CollectorProfile } from '../auth.model';
import { vi } from 'vitest';

/**
 * Creates a mocked version of IProfileRepository for testing.
 * Includes a Subject to manually emit profile states.
 */
export function createProfileRepositoryMock(): any {
  const profile$ = new Subject<CollectorProfile | null>();

  return {
    getProfile: vi.fn(() => profile$.asObservable()),
    createProfile: vi.fn().mockResolvedValue(undefined),
    updateProfile: vi.fn().mockResolvedValue(undefined),
    deleteProfile: vi.fn().mockResolvedValue(undefined),
    // Helper to allow tests to emit states
    _emitProfile: (profile: CollectorProfile | null) => profile$.next(profile)
  };
}
