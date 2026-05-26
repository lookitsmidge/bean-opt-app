import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { UsersStore } from '@boa/core-auth-application';
import { signal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { vi } from 'vitest';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let mockUsersStore: any;

  beforeEach(async () => {
    mockUsersStore = {
      users: signal([]),
      loading: signal(false),
      saving: signal(false),
      error: signal(null),
      searchQuery: signal(''),
      roleFilter: signal('all'),
      stats: signal({ total: 10, admin: 1, moderator: 1, seller: 1, banned: 1 }),
      totalUsers: signal(10),
      currentPage: signal(1),
      pageSize: signal(10),
      totalPages: signal(1),
      searchUsers: vi.fn(),
      loadStats: vi.fn(),
      setPage: vi.fn(),
      setRoleFilter: vi.fn(),
      updateUserRole: vi.fn(),
      toggleUserBan: vi.fn(),
      hardDeleteUser: vi.fn(),
    };

    // Global mock for confirm
    globalThis.confirm = vi.fn(() => true);

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [
        provideAnimationsAsync('noop'),
      ],
    })
    .overrideComponent(UserManagementComponent, {
      set: {
        providers: [
          { provide: UsersStore, useValue: mockUsersStore }
        ],
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load stats and users', () => {
    expect(mockUsersStore.loadStats).toHaveBeenCalled();
    expect(mockUsersStore.searchUsers).toHaveBeenCalledWith('');
  });

  it('should update role filter when a stat card is clicked', () => {
    const adminCard = fixture.nativeElement.querySelector('.grid button:nth-child(2)');
    adminCard.click();
    expect(mockUsersStore.setRoleFilter).toHaveBeenCalledWith('admin');
  });

  it('should call searchUsers when search event is emitted', () => {
    component['store'].searchUsers('new search');
    expect(mockUsersStore.searchUsers).toHaveBeenCalledWith('new search');
  });

  it('should call toggleUserBan when onBanClick is confirmed', async () => {
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    const mockUser: any = { uid: '1', handle: 'testuser', isBanned: false };
    await component.onBanClick(mockUser);

    expect(globalThis.confirm).toHaveBeenCalled();
    expect(mockUsersStore.toggleUserBan).toHaveBeenCalledWith('1');
  });

  it('should NOT call toggleUserBan when onBanClick is cancelled', async () => {
    vi.spyOn(globalThis, 'confirm').mockReturnValue(false);
    const mockUser: any = { uid: '1', handle: 'testuser', isBanned: false };
    await component.onBanClick(mockUser);

    expect(mockUsersStore.toggleUserBan).not.toHaveBeenCalled();
  });

  it('should call hardDeleteUser when onDeleteClick is confirmed', async () => {
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
    const mockUser: any = { uid: '1', handle: 'testuser' };
    await component.onDeleteClick(mockUser);

    expect(globalThis.confirm).toHaveBeenCalled();
    expect(mockUsersStore.hardDeleteUser).toHaveBeenCalledWith('1');
  });

  it('should call updateUserRole when role button is clicked', () => {
    const mockUser: any = { uid: '1', handle: 'testuser', roles: [], displayName: 'Test' };
    mockUsersStore.users.set([mockUser]);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((b: any, index: number) => {
      console.log(`Button ${index}: "${b.textContent.trim()}"`);
    });

    const commanderBtn = Array.from(buttons).find((b: any) => b.textContent.trim() === 'Commander') as HTMLButtonElement;
    console.log('Found commanderBtn:', !!commanderBtn);
    if (commanderBtn) {
      commanderBtn.click();
    }

    expect(mockUsersStore.updateUserRole).toHaveBeenCalledWith({ uid: '1', role: 'admin' });
  });
});
