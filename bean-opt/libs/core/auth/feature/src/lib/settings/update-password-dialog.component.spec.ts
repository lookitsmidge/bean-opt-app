import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePasswordDialogComponent } from './update-password-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';

describe('UpdatePasswordDialogComponent', () => {
  let component: UpdatePasswordDialogComponent;
  let fixture: ComponentFixture<UpdatePasswordDialogComponent>;
  let mockDialogRef: any;

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        UpdatePasswordDialogComponent, 
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate password length', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.valid).toBeFalsy();
    
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should validate password match', () => {
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

  it('should call dialogRef.close(password) on submit', () => {
    component.form.patchValue({
      password: 'new-password123',
      confirmPassword: 'new-password123'
    });
    
    component.submit();
    
    expect(mockDialogRef.close).toHaveBeenCalledWith('new-password123');
  });

  it('should call dialogRef.close(null) on cancel', () => {
    component.cancel();
    
    expect(mockDialogRef.close).toHaveBeenCalledWith(null);
  });
});
