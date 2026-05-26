import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsDashboardComponent } from './settings-dashboard.component';
import { AuthStore, ProfileStore } from '@boa/core-auth-application';
import { Router, provideRouter } from '@angular/router';
import { UpdatePasswordDialogService } from './update-password-dialog.service';
import { signal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { vi } from 'vitest';

describe('SettingsDashboardComponent', () => {
  let component: SettingsDashboardComponent;
  let fixture: ComponentFixture<SettingsDashboardComponent>;
  let authStore: any;
  let profileStore: any;
  let passwordDialog: any;

  beforeEach(async () => {
    authStore = {
      logout: vi.fn(() => Promise.resolve()),
      updatePassword: vi.fn(() => Promise.resolve()),
      user: signal({ uid: '1', providerId: 'password', isAnonymous: false }),
      status: signal('authenticated'),
      isAdmin: signal(false)
    };

    profileStore = {
      deleteAccount: vi.fn(() => Promise.resolve()),
      profile: signal({ uid: '1', displayName: 'Test', handle: 'test' }),
      syncStatus: signal('ready')
    };

    passwordDialog = {
      open: vi.fn(() => Promise.resolve('new-pass')),
      isOpen: signal(false),
      close: vi.fn()
    };

    // Global mock for alert and confirm
    window.alert = vi.fn();
    const globalConfirmMock = vi.fn(() => true);
    globalThis.confirm = globalConfirmMock;
    window.confirm = globalConfirmMock;

    await TestBed.configureTestingModule({
      imports: [SettingsDashboardComponent],
      providers: [
        provideRouter([
            { path: 'auth', redirectTo: '' },
            { path: 'privacy-policy', redirectTo: '' },
            { path: 'terms-and-conditions', redirectTo: '' }
        ]),
        provideAnimationsAsync('noop'),
        { provide: AuthStore, useValue: authStore },
        { provide: ProfileStore, useValue: profileStore },
        { provide: UpdatePasswordDialogService, useValue: passwordDialog }
      ]
    })
    .overrideComponent(SettingsDashboardComponent, {
        set: {
            providers: [
                { provide: UpdatePasswordDialogService, useValue: passwordDialog }
            ]
        }
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear cache when confirmed', async () => {
    const confirmSpy = vi.fn(() => true);
    globalThis.confirm = confirmSpy;
    window.confirm = confirmSpy;
    const clearSpy = vi.spyOn(Storage.prototype, 'clear');
    await component.clearCache();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should NOT clear cache when cancelled', async () => {
    const confirmSpy = vi.fn(() => false);
    globalThis.confirm = confirmSpy;
    window.confirm = confirmSpy;
    const clearSpy = vi.spyOn(Storage.prototype, 'clear');
    await component.clearCache();
    expect(clearSpy).not.toHaveBeenCalled();
  });

  it('should update password when dialog returns new password', async () => {
    passwordDialog.open.mockReturnValue(Promise.resolve('new-pass'));
    await component.updatePassword();
    expect(authStore.updatePassword).toHaveBeenCalledWith('new-pass');
  });

  it('should logout and navigate when confirmed', async () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    const confirmSpy = vi.fn(() => true);
    globalThis.confirm = confirmSpy;
    window.confirm = confirmSpy;
    await component.logout();
    expect(authStore.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should delete account and navigate when confirmed', async () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    const confirmSpy = vi.fn(() => true);
    globalThis.confirm = confirmSpy;
    window.confirm = confirmSpy;
    await component.deleteAccount();
    expect(profileStore.deleteAccount).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
