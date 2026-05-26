import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationComponent } from './authentication.component';
import { AuthStore, ProfileStore } from '@boa/core-auth-application';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { vi } from 'vitest';

describe('AuthenticationComponent', () => {
  let component: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;

  // Mock AuthStore
  const mockAuthStore = {
    user: signal<any>(null),
    status: signal('unauthenticated'),
    error: signal<string | null>(null),
    isAdmin: signal(false),
    isAdminMode: signal(false),
    login: vi.fn(),
    signUp: vi.fn(),
    loginWithGoogle: vi.fn(),
    continueAsGuest: vi.fn()
  };

  // Mock ProfileStore
  const mockProfileStore = {
    profile: signal(null),
    syncStatus: signal('idle')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticationComponent],
      providers: [
        provideRouter([
            { path: 'catalog', redirectTo: '' },
            { path: 'vaults', redirectTo: '' },
            { path: 'home', redirectTo: '' },
            { path: 'auth', redirectTo: '' }
        ]),
        provideAnimationsAsync('noop'),
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: ProfileStore, useValue: mockProfileStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authStore.login when mode is "login"', () => {
    component.mode.set('login');
    const credentials = { email: 'test@wfi.com', password: 'password123', displayName: '', privacyPolicyAccepted: true };
    
    component.handleAuth(credentials);

    expect(mockAuthStore.login).toHaveBeenCalledWith('test@wfi.com', 'password123');
  });

  it('should call authStore.signUp when mode is "signup"', () => {
    component.mode.set('signup');
    const credentials = { email: 'test@wfi.com', password: 'password123', displayName: 'Test User', privacyPolicyAccepted: true };
    
    component.handleAuth(credentials);

    expect(mockAuthStore.signUp).toHaveBeenCalledWith('test@wfi.com', 'password123', 'Test User', true);
  });

  it('should call authStore.loginWithGoogle', () => {
    component.handleGoogleLogin();
    expect(mockAuthStore.loginWithGoogle).toHaveBeenCalled();
  });

  it('should call authStore.continueAsGuest', async () => {
    await component.onGuestLogin();
    expect(mockAuthStore.continueAsGuest).toHaveBeenCalled();
  });

  it('should navigate to /home onLogin', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    component.onLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});

