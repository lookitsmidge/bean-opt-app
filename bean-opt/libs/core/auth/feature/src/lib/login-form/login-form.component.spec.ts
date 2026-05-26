import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { AuthStore } from '@boa/core-auth-application';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  // Mock AuthStore
  const mockAuthStore = {
    error: signal<string | null>(null),
    status: signal('idle')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthStore, useValue: mockAuthStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with login mode', () => {
    expect(component.mode()).toBe('login');
  });

  it('should validate email field', () => {
    const emailControl = component.authForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('test@wfi.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password length', () => {
    const passwordControl = component.authForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.valid).toBeFalsy();
    
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should emit submitAuth when form is valid and processForm is called', () => {
    vi.spyOn(component.submitAuth, 'emit');
    
    component.authForm.patchValue({
      email: 'test@wfi.com',
      password: 'password123',
      privacyPolicyAccepted: true
    });

    component.processForm();

    expect(component.submitAuth.emit).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@wfi.com',
      password: 'password123',
      privacyPolicyAccepted: true
    }));
  });

  it('should not emit submitAuth if form is invalid', () => {
    vi.spyOn(component.submitAuth, 'emit');
    
    component.authForm.patchValue({
      email: 'invalid',
      password: 'short'
    });

    component.processForm();

    expect(component.submitAuth.emit).not.toHaveBeenCalled();
  });

  it('should emit googleLogin when google button is clicked', () => {
    vi.spyOn(component.googleLogin, 'emit');
    
    const button = fixture.nativeElement.querySelector('button'); // First button is Google
    button.click();

    expect(component.googleLogin.emit).toHaveBeenCalled();
  });

  it('should show error message from authStore', () => {
    mockAuthStore.error.set('Login Failed');
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.bg-rose-50 p');
    expect(errorElement.textContent).toContain('Login Failed');
  });
});

