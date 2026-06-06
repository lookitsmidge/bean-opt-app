import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, output, effect } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthStore } from "@boa/core-auth-application";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'lib-login-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
    templateUrl: './login-form.component.html',
    styles: [`
        .animate-in { 
            animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUp { 
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            } 
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        .animate-float { 
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float { 
            0% { 
                transform: translateY(0px); 
            } 
            50% { 
                transform: translateY(-10px); 
            } 
            100% { 
                transform: translateY(0px); 
            } 
        }
        .logo-box {
            background: color-mix(in srgb, var(--mat-sys-surface-container) 60%, transparent);
            border: 1px solid color-mix(in srgb, var(--mat-sys-outline-variant) 30%, transparent);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        .logo-icon {
            color: var(--mat-sys-primary);
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
    protected authStore = inject(AuthStore);
    mode = input<'login' | 'signup'>('login');
    isLoading = input<boolean>(false);
    logoSrc = input<string | null>(null);

    submitAuth = output<{ email: string, password: string, displayName: string, privacyPolicyAccepted: boolean }>();
    googleLogin = output<void>();
    guestLogin = output<void>();
    toggleMode = output<'login' | 'signup'>();

    // Form Implementation
    authForm = new FormGroup({
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
        confirmPassword: new FormControl('', { nonNullable: true }),
        displayName: new FormControl('', { nonNullable: true }),
        privacyPolicyAccepted: new FormControl(false, { nonNullable: true })
    }, { validators: (group) => this.passwordMatchValidator(group) });

    constructor() {
        effect(() => {
            const mode = this.mode();
            const displayNameControl = this.authForm.get('displayName');
            if (mode === 'signup') {
                displayNameControl?.setValidators([Validators.required]);
            } else {
                displayNameControl?.clearValidators();
            }
            displayNameControl?.updateValueAndValidity();
        });
    }

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        // Only validate password match in signup mode
        if (this.mode() !== 'signup') return null;

        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        const privacyPolicyAccepted = control.get('privacyPolicyAccepted');

        const errors: ValidationErrors = {};

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            errors['passwordMismatch'] = true;
        }

        if (privacyPolicyAccepted && !privacyPolicyAccepted.value) {
            errors['privacyPolicyNotAccepted'] = true;
        }

        return Object.keys(errors).length > 0 ? errors : null;
    }

    /** Helper to check if a specific field should show error styling */
    isFieldInvalid(fieldName: string): boolean {
        const control = this.authForm.get(fieldName);
        return !!(control && control.invalid && (control.touched || control.dirty));
    }

    isPasswordMismatch = computed(() => {
        return this.mode() === 'signup' &&
            this.authForm.hasError('passwordMismatch') &&
            (this.authForm.get('confirmPassword')?.touched || this.authForm.get('confirmPassword')?.dirty);
    });

    processForm() {
        if (this.authForm.invalid) {
            this.authForm.markAllAsTouched();
            return;
        }

        const formData = this.authForm.getRawValue();
        this.submitAuth.emit(formData);
    }
}
