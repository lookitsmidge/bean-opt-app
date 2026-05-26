import { Subject } from 'rxjs';
import { AuthUser } from '../auth.model';
import { vi } from 'vitest';

/**
 * Creates a mocked version of IAuthRepository for testing.
 * Includes a Subject to manually emit auth states.
 */
export function createAuthRepositoryMock(): any { // Using any for simplicity with Vitest mocks
  const authState$ = new Subject<AuthUser | null>();

  return {
    authState: vi.fn(() => authState$.asObservable()),
    login: vi.fn(),
    logout: vi.fn(),
    signUp: vi.fn(),
    continueAsGuest: vi.fn(),
    deleteAccount: vi.fn(),
    updatePassword: vi.fn(),
    loginWithGoogle: vi.fn(),
    updateUserRole: vi.fn(),
    searchUsers: vi.fn(),
    getUsersCountByRole: vi.fn(),
    toggleUserBan: vi.fn(),
    hardDeleteUser: vi.fn(),
    // Helper to allow tests to emit states
    _emitAuthState: (user: AuthUser | null) => authState$.next(user),
    _emitAuthError: (error: any) => authState$.error(error)
  };
}
