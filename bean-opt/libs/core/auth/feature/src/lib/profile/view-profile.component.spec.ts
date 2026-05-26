import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProfileComponent } from './view-profile.component';
import { AuthStore, ProfileStore } from '@boa/core-auth-application';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('ViewProfileComponent', () => {
  let component: ViewProfileComponent;
  let fixture: ComponentFixture<ViewProfileComponent>;

  // Mock AuthStore
  const mockAuthStore = {
    user: signal<any>(null),
    isAdmin: signal(false),
    logout: vi.fn()
  };

  // Mock ProfileStore
  const mockProfileStore = {
    profile: signal<any>(null)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfileComponent],
      providers: [
        provideRouter([
            { path: 'auth', redirectTo: '' }
        ]),
        { provide: AuthStore, useValue: mockAuthStore },
        { provide: ProfileStore, useValue: mockProfileStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute avatar initials from displayName', () => {
    mockAuthStore.user.set({ displayName: 'John Doe', photoUrl: null });
    mockProfileStore.profile.set({ uid: '1' });
    fixture.detectChanges();

    expect(component.UsersAvatar()).toBe('JD');
  });

  it('should compute avatar initials from single name', () => {
    mockAuthStore.user.set({ displayName: 'John', photoUrl: null });
    mockProfileStore.profile.set({ uid: '1' });
    fixture.detectChanges();

    expect(component.UsersAvatar()).toBe('J');
  });

  it('should return photoUrl if available', () => {
    mockAuthStore.user.set({ displayName: 'John Doe', photoUrl: 'http://photo.com' });
    mockProfileStore.profile.set({ uid: '1' });
    fixture.detectChanges();

    expect(component.UsersAvatar()).toBe('http://photo.com');
  });

  it('should return "?" if no profile or user', () => {
    mockAuthStore.user.set(null);
    mockProfileStore.profile.set(null);
    fixture.detectChanges();

    expect(component.UsersAvatar()).toBe('?');
  });

  it('should logout and navigate to /auth', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    component.logout();
    expect(mockAuthStore.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});


