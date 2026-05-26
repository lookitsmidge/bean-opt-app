import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePasswordDialogComponent } from './update-password-dialog.component';
import { UpdatePasswordDialogService } from './update-password-dialog.service';
import { signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('UpdatePasswordDialogComponent', () => {
  let component: UpdatePasswordDialogComponent;
  let fixture: ComponentFixture<UpdatePasswordDialogComponent>;
  let mockVs: any;

  beforeEach(async () => {
    mockVs = {
      isOpen: signal(false),
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [UpdatePasswordDialogComponent, ReactiveFormsModule],
      providers: [
        { provide: UpdatePasswordDialogService, useValue: mockVs }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden when vs.isOpen is false', () => {
    mockVs.isOpen.set(false);
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('.fixed');
    expect(modal).toBeFalsy();
  });

  it('should be visible when vs.isOpen is true', () => {
    mockVs.isOpen.set(true);
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('.fixed');
    expect(modal).toBeTruthy();
  });

  it('should validate password length', () => {
    mockVs.isOpen.set(true);
    fixture.detectChanges();
    
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.valid).toBeFalsy();
    
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should validate password match', () => {
    mockVs.isOpen.set(true);
    fixture.detectChanges();
    
    component.form.patchValue({
      password: 'password123',
      confirmPassword: 'wrong-password'
    });
    
    expect(component.form.hasError('passwordMismatch')).toBeTruthy();
    
    component.form.patchValue({
      confirmPassword: 'password123'
    });
    
    expect(component.form.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should call vs.close(password) on submit', () => {
    mockVs.isOpen.set(true);
    fixture.detectChanges();
    
    component.form.patchValue({
      password: 'new-password123',
      confirmPassword: 'new-password123'
    });
    
    component.submit();
    
    expect(mockVs.close).toHaveBeenCalledWith('new-password123');
  });

  it('should call vs.close(null) on cancel', () => {
    mockVs.isOpen.set(true);
    fixture.detectChanges();
    
    component.cancel();
    
    expect(mockVs.close).toHaveBeenCalledWith(null);
  });
});
