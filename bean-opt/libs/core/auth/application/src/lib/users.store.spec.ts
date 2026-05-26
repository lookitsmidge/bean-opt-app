import { TestBed } from '@angular/core/testing';
import { UsersStore } from './users.store';
import { AUTH_REPOSITORY_TOKEN, CollectorProfile } from '@boa/core-auth-domain';
import { createAuthRepositoryMock } from '@boa/core-auth-domain/testing';

describe('UsersStore', () => {
  let mockAuthRepository: any;

  const mockUsers: CollectorProfile[] = [
    {
      uid: '1',
      displayName: 'User One',
      handle: 'user1',
      photoUrl: '',
      bio: '',
      stats: { totalCollected: 0, followers: 0 },
      roles: ['collector'],
      isBanned: false,
      privacyPolicyAcceptedAt: '2026-04-13T12:00:00Z'
    }
  ];

  beforeEach(() => {
    mockAuthRepository = createAuthRepositoryMock();
    
    // Default mock returns
    mockAuthRepository.searchUsers.mockResolvedValue({ users: mockUsers, totalCount: 1 });
    mockAuthRepository.getUsersCountByRole.mockResolvedValue({});

    TestBed.configureTestingModule({
      providers: [
        UsersStore,
        { provide: AUTH_REPOSITORY_TOKEN, useValue: mockAuthRepository }
      ],
    });
  });

  async function waitFor(store: any, predicate: (s: any) => boolean) {
    let retries = 50;
    while (!predicate(store) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 5));
      retries--;
    }
  }

  it('should initialize with initial state', () => {
    const store = TestBed.inject(UsersStore);
    expect(store.users()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.totalUsers()).toBe(0);
    expect(store.currentPage()).toBe(1);
  });

  it('should load users on searchUsers', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.searchUsers.mockResolvedValue({ users: mockUsers, totalCount: 1 });

    store.searchUsers('test');
    await waitFor(store, s => !s.loading());

    expect(mockAuthRepository.searchUsers).toHaveBeenCalledWith('test', 1, 10, 'all');
    expect(store.users()).toEqual(mockUsers);
    expect(store.totalUsers()).toBe(1);
    expect(store.loading()).toBe(false);
  });

  it('should handle search error', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.searchUsers.mockRejectedValue(new Error('Search failed'));

    store.searchUsers('test');
    await waitFor(store, s => !!s.error());

    expect(store.error()).toBe('Search failed');
    expect(store.loading()).toBe(false);
  });

  it('should update page and reload users', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.searchUsers.mockResolvedValue({ users: [], totalCount: 20 });

    store.setPage(2);
    await waitFor(store, s => s.currentPage() === 2 && !s.loading());

    expect(mockAuthRepository.searchUsers).toHaveBeenCalledWith('', 2, 10, 'all');
    expect(store.currentPage()).toBe(2);
  });

  it('should update role filter and reload users', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.searchUsers.mockResolvedValue({ users: [], totalCount: 0 });

    store.setRoleFilter('admin');
    await waitFor(store, s => s.roleFilter() === 'admin' && !s.loading());

    expect(mockAuthRepository.searchUsers).toHaveBeenCalledWith('', 1, 10, 'admin');
    expect(store.roleFilter()).toBe('admin');
  });

  it('should load stats', async () => {
    const store = TestBed.inject(UsersStore);
    const mockStats = { collector: 10, admin: 1 };
    mockAuthRepository.getUsersCountByRole.mockResolvedValue(mockStats);

    store.loadStats();
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(mockAuthRepository.getUsersCountByRole).toHaveBeenCalled();
    expect(store.stats()).toEqual(mockStats);
  });

  it('should handle updateUserRole and refresh', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.updateUserRole.mockResolvedValue(undefined);
    mockAuthRepository.searchUsers.mockResolvedValue({ users: [], totalCount: 0 });
    mockAuthRepository.getUsersCountByRole.mockResolvedValue({});

    store.updateUserRole({ uid: '1', role: 'admin' });
    await waitFor(store, s => !s.saving());

    expect(mockAuthRepository.updateUserRole).toHaveBeenCalledWith('1', 'admin');
    expect(mockAuthRepository.searchUsers).toHaveBeenCalled();
    expect(mockAuthRepository.getUsersCountByRole).toHaveBeenCalled();
    expect(store.saving()).toBe(false);
  });

  it('should handle toggleUserBan and refresh', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.toggleUserBan.mockResolvedValue(undefined);
    mockAuthRepository.searchUsers.mockResolvedValue({ users: [], totalCount: 0 });

    store.toggleUserBan('1');
    await waitFor(store, s => !s.saving());

    expect(mockAuthRepository.toggleUserBan).toHaveBeenCalledWith('1');
    expect(mockAuthRepository.searchUsers).toHaveBeenCalled();
    expect(store.saving()).toBe(false);
  });

  it('should handle hardDeleteUser and refresh', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.hardDeleteUser.mockResolvedValue(undefined);
    mockAuthRepository.searchUsers.mockResolvedValue({ users: [], totalCount: 0 });

    store.hardDeleteUser('1');
    await waitFor(store, s => !s.saving());

    expect(mockAuthRepository.hardDeleteUser).toHaveBeenCalledWith('1');
    expect(mockAuthRepository.searchUsers).toHaveBeenCalled();
    expect(store.saving()).toBe(false);
  });

  it('should update totalPages when totalUsers changes', async () => {
    const store = TestBed.inject(UsersStore);
    mockAuthRepository.searchUsers.mockResolvedValue({ users: [], totalCount: 25 });

    store.searchUsers('');
    await waitFor(store, s => s.totalUsers() === 25);

    expect(store.totalPages()).toBe(3); // 25 users / 10 per page = 3 pages
  });
});
