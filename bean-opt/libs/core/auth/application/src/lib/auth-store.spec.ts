import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth-store';
import { AUTH_REPOSITORY_TOKEN, AuthUser } from '@boa/core-auth-domain';
import { createAuthRepositoryMock } from '@boa/core-auth-domain/testing';

describe('AuthStore', () => {
  let mockAuthRepository: any;

  beforeEach(() => {
    mockAuthRepository = createAuthRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AUTH_REPOSITORY_TOKEN, useValue: mockAuthRepository }
      ],
    });
  });

  it('should initialize with status "loading"', () => {
    const store = TestBed.inject(AuthStore);
    expect(store.status()).toBe('loading');
    expect(store.user()).toBeNull();
  });

  it('should transition to "authenticated" when a user is emitted', () => {
    const store = TestBed.inject(AuthStore);
    
    const mockUser: AuthUser = {
      uid: '123',
      email: 'test@wfi.com',
      displayName: 'Test User',
      photoUrl: null,
      isAnonymous: false,
      providerId: 'password',
      handle: null,
      roles: [],
      isBanned: false,
      privacyPolicyAcceptedAt: null
    };

    mockAuthRepository._emitAuthState(mockUser);
    expect(store.user()).toEqual(mockUser);
    expect(store.status()).toBe('authenticated');
  });

  it('should correctly compute roles and admin status', () => {
    const store = TestBed.inject(AuthStore);
    
    const adminUser: AuthUser = {
      uid: 'admin',
      email: 'admin@wfi.com',
      displayName: 'Admin User',
      photoUrl: null,
      handle: 'admin',
      isAnonymous: false,
      providerId: 'password',
      roles: ['admin', 'moderator'],
      isBanned: false,
      privacyPolicyAcceptedAt: '2024-01-01'
    };

    mockAuthRepository._emitAuthState(adminUser);

    expect(store.isAdmin()).toBe(true);
    expect(store.isModerator()).toBe(true);
    expect(store.roles()).toEqual(['admin', 'moderator']);
  });

  it('should toggle admin mode and compute adminModeActive correctly', () => {
    const store = TestBed.inject(AuthStore);
    
    const adminUser: AuthUser = {
      uid: 'admin',
      email: 'admin@wfi.com',
      displayName: 'Admin User',
      photoUrl: null,
      handle: 'admin',
      isAnonymous: false,
      providerId: 'password',
      roles: ['admin'],
      isBanned: false,
      privacyPolicyAcceptedAt: '2024-01-01'
    };

    mockAuthRepository._emitAuthState(adminUser);
    expect(store.isAdmin()).toBe(true);
    expect(store.isAdminMode()).toBe(false);
    expect(store.adminModeActive()).toBe(false);

    store.toggleAdminMode();
    expect(store.isAdminMode()).toBe(true);
    expect(store.adminModeActive()).toBe(true);

    // If user is not admin, adminModeActive should be false even if isAdminMode is true
    const normalUser: AuthUser = { ...adminUser, roles: [] };
    mockAuthRepository._emitAuthState(normalUser);
    expect(store.isAdmin()).toBe(false);
    expect(store.adminModeActive()).toBe(false);
  });

  it('should transition to "unauthenticated" when null is emitted', () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository._emitAuthState(null);
    expect(store.user()).toBeNull();
    expect(store.status()).toBe('unauthenticated');
  });

  it('should handle auth state subscription error', () => {
    const store = TestBed.inject(AuthStore);
    
    mockAuthRepository._emitAuthError(new Error('Sync Error'));

    expect(store.status()).toBe('unauthenticated');
    expect(store.error()).toBe('Sync Error');
  });

  it('should handle login success', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.login.mockResolvedValue(undefined);

    await store.login('test@wfi.com', 'pass');

    expect(mockAuthRepository.login).toHaveBeenCalledWith('test@wfi.com', 'pass');
    expect(store.error()).toBeNull();
  });

  it('should handle login error', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.login.mockRejectedValue(new Error('Login Failed'));

    await store.login('test@wfi.com', 'pass');

    expect(store.status()).toBe('unauthenticated');
    expect(store.error()).toBe('Login Failed');
  });

  it('should handle signUp and manual user patch if displayName is missing', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.signUp.mockResolvedValue(undefined);
    
    // Simulate user emitted by sync hook BEFORE signUp finishes, but missing displayName
    const partialUser: AuthUser = { uid: '1', email: 't@t.com', displayName: null, isAnonymous: false, photoUrl: '', providerId: 'p', roles: [], handle: 'user', isBanned: false, privacyPolicyAcceptedAt: null };
    mockAuthRepository._emitAuthState(partialUser);

    await store.signUp('t@t.com', 'p', 'New Name', true);

    expect(store.user()?.displayName).toBe('New Name');
    expect(mockAuthRepository.signUp).toHaveBeenCalledWith('t@t.com', 'p', 'New Name', true);
  });

  it('should handle signUp error', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.signUp.mockRejectedValue(new Error('Sign Up Failed'));

    await store.signUp('t@t.com', 'p', 'Name', true);

    expect(store.status()).toBe('unauthenticated');
    expect(store.error()).toBe('Sign Up Failed');
  });

  it('should handle continueAsGuest', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.continueAsGuest.mockResolvedValue(undefined);

    await store.continueAsGuest();

    expect(mockAuthRepository.continueAsGuest).toHaveBeenCalled();
  });

  it('should handle continueAsGuest error', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.continueAsGuest.mockRejectedValue(new Error('Guest Failed'));

    await store.continueAsGuest();

    expect(store.status()).toBe('unauthenticated');
    expect(store.error()).toBe('Guest Failed');
  });

  it('should handle logout success and redirect', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.logout.mockResolvedValue(undefined);
    
    await store.logout();

    expect(mockAuthRepository.logout).toHaveBeenCalled();
    expect(store.user()).toBeNull();
    expect(store.status()).toBe('unauthenticated');
    // Note: window.location.assign is wrapped in try-catch in the store to handle JSDOM
  });

  it('should handle logout error', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.logout.mockRejectedValue(new Error('Logout Failed'));

    await store.logout();

    expect(store.error()).toBe('Logout Failed');
  });

  it('should handle loginWithGoogle error', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.loginWithGoogle.mockRejectedValue(new Error('Google Failed'));

    try {
      await store.loginWithGoogle();
    } catch (e) {
      // Expected for test
    }

    expect(store.status()).toBe('unauthenticated');
    expect(store.error()).toBe('Google Failed');
  });

  it('should handle deleteAccount success', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.deleteAccount.mockResolvedValue(undefined);

    await store.deleteAccount();

    expect(mockAuthRepository.deleteAccount).toHaveBeenCalled();
  });

  it('should handle deleteAccount error', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.deleteAccount.mockRejectedValue(new Error('Delete Failed'));

    try {
      await store.deleteAccount();
    } catch (e) {
      // Expected for test
    }

    expect(store.status()).toBe('authenticated');
    expect(store.error()).toBe('Delete Failed');
  });

  it('should handle updatePassword error', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.updatePassword.mockRejectedValue(new Error('Update Password Failed'));

    try {
      await store.updatePassword('new-pass');
    } catch (e) {
      // Expected for test
    }

    expect(store.error()).toBe('Update Password Failed');
  });

  it('should handle updatePassword', async () => {
    const store = TestBed.inject(AuthStore);
    mockAuthRepository.updatePassword.mockResolvedValue(undefined);

    await store.updatePassword('new-pass');

    expect(mockAuthRepository.updatePassword).toHaveBeenCalledWith('new-pass');
  });
});

