import { TestBed } from '@angular/core/testing';
import { ProfileStore } from './profile.store';
import { AuthStore } from './auth-store';
import { 
  AUTH_REPOSITORY_TOKEN, 
  PROFILE_REPOSITORY_TOKEN, 
  AuthUser,
  CollectorProfile
} from '@boa/core-auth-domain';
import { createAuthRepositoryMock, createProfileRepositoryMock } from '@boa/core-auth-domain/testing';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

describe('ProfileStore', () => {
  let mockAuthRepo: any;
  let mockProfileRepo: any;
  
  const mockAuthStore = {
    user: signal<AuthUser | null>(null),
    status: signal('loading'),
    deleteAccount: vi.fn().mockResolvedValue(undefined)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthRepo = createAuthRepositoryMock();
    mockProfileRepo = createProfileRepositoryMock();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: mockAuthStore },
        ProfileStore,
        { provide: PROFILE_REPOSITORY_TOKEN, useValue: mockProfileRepo }
      ],
    });
  });

  async function waitForStatus(store: any, target: string) {
    let retries = 50;
    while (store.syncStatus() !== target && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 5));
      retries--;
    }
  }

  it('should initialize with status "idle" and null profile', () => {
    const store = TestBed.inject(ProfileStore);
    expect(store.syncStatus()).toBe('idle');
    expect(store.profile()).toBeNull();
  });

  it('should load profile when user is authenticated and not anonymous', async () => {
    const store = TestBed.inject(ProfileStore);
    
    const user = { uid: 'u1', isAnonymous: false };
    mockAuthStore.user.set(user as any);
    
    TestBed.flushEffects();
    await waitForStatus(store, 'syncing'); // Should start syncing

    expect(mockProfileRepo.getProfile).toHaveBeenCalledWith('u1');

    const profile = { uid: 'u1', displayName: 'Test' };
    mockProfileRepo._emitProfile(profile);
    
    await waitForStatus(store, 'ready');
    TestBed.flushEffects();

    expect(store.profile()).toEqual(profile);
    expect(store.syncStatus()).toBe('ready');
  });

  it('should handle profile sync error', async () => {
    const store = TestBed.inject(ProfileStore);
    mockAuthStore.user.set({ uid: 'u1', isAnonymous: false } as any);
    
    const error$ = new Subject<any>();
    mockProfileRepo.getProfile.mockReturnValue(error$);
    
    TestBed.flushEffects();
    await waitForStatus(store, 'syncing');

    error$.error(new Error('Sync Error'));
    await waitForStatus(store, 'error');
    TestBed.flushEffects();

    expect(store.syncStatus()).toBe('error');
    expect(store.error()).toBe('Sync Error');
  });

  it('should set status to idle if profile is null', async () => {
    const store = TestBed.inject(ProfileStore);
    mockAuthStore.user.set({ uid: 'u1', isAnonymous: false } as any);
    
    TestBed.flushEffects();
    await waitForStatus(store, 'syncing');

    mockProfileRepo._emitProfile(null);
    await waitForStatus(store, 'idle');
    TestBed.flushEffects();

    expect(store.profile()).toBeNull();
    expect(store.syncStatus()).toBe('idle');
  });

  it('should trigger auto-creation sequence when user is logged in but profile is null', async () => {
    const store = TestBed.inject(ProfileStore);
    
    mockAuthStore.user.set({ uid: 'new-user', email: 'new@t.com', isAnonymous: false } as any);
    mockAuthStore.status.set('authenticated');
    
    TestBed.flushEffects();
    await waitForStatus(store, 'syncing');

    mockProfileRepo._emitProfile(null);
    await waitForStatus(store, 'idle');
    TestBed.flushEffects();

    // The auto-creation sequence is async, wait a bit
    await new Promise(resolve => setTimeout(resolve, 20));
    TestBed.flushEffects();

    expect(mockProfileRepo.createProfile).toHaveBeenCalled();
  });

  it('should clear profile if user is anonymous', async () => {
    const store = TestBed.inject(ProfileStore);
    
    mockAuthStore.user.set({ uid: 'guest', isAnonymous: true } as any);
    TestBed.flushEffects();
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(store.profile()).toBeNull();
  });

  it('should handle updateProfileData error', async () => {
    const store = TestBed.inject(ProfileStore);
    mockAuthStore.user.set({ uid: 'u1', isAnonymous: false } as any);
    mockProfileRepo.updateProfile.mockRejectedValue(new Error('Update Failed'));

    try {
      await store.updateProfileData({ bio: 'fail' });
    } catch (e) {
      // Expected for test
    }

    expect(store.syncStatus()).toBe('error');
    expect(store.error()).toBe('Update Failed');
  });

  it('should handle updateDisplayName', async () => {
    const store = TestBed.inject(ProfileStore);
    mockAuthStore.user.set({ uid: 'u1', isAnonymous: false } as any);
    
    await store.updateDisplayName('New Name');

    expect(mockProfileRepo.updateProfile).toHaveBeenCalledWith('u1', { displayName: 'New Name' });
  });

  it('should handle deleteAccount success', async () => {
    const store = TestBed.inject(ProfileStore);
    mockAuthStore.user.set({ uid: 'u1', isAnonymous: false } as any);
    
    await store.deleteAccount();

    expect(mockProfileRepo.deleteProfile).toHaveBeenCalledWith('u1');
    expect(mockAuthStore.deleteAccount).toHaveBeenCalled();
    expect(store.profile()).toBeNull();
  });

  it('should handle createInitialProfile success', async () => {
    const store = TestBed.inject(ProfileStore);
    const user = { uid: 'u1', email: 't@t.com', displayName: 'T', isAnonymous: false };
    
    await store.createInitialProfile(user as any);

    expect(mockProfileRepo.createProfile).toHaveBeenCalledWith(expect.objectContaining({
      uid: 'u1',
      displayName: 'T'
    }));
  });

  it('should handle createInitialProfile error', async () => {
    const store = TestBed.inject(ProfileStore);
    mockProfileRepo.createProfile.mockRejectedValue(new Error('Create Failed'));

    try {
      await store.createInitialProfile({ uid: 'u1' } as any);
    } catch (e) {
      // Expected for test
    }

    expect(store.syncStatus()).toBe('error');
    expect(store.error()).toBe('Create Failed');
  });

  it('should throw error if attempting commands while logged out', async () => {
    const store = TestBed.inject(ProfileStore);
    mockAuthStore.user.set(null);

    await expect(store.updateBio('test')).rejects.toThrow('Unauthorised or Guest Session');
  });

});

