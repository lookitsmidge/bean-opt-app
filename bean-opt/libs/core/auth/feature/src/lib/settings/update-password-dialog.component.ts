import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: 'lib-update-password-dialog',
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatDialogModule, 
        MatButtonModule
    ],
    template: `
    <div class="p-1 animate-in zoom-in-95 duration-200">
        <h2 mat-dialog-title class="text-center text-2xl font-black italic uppercase tracking-tighter text-[var(--mat-sys-on-surface)] leading-none mb-1">
            Modify Access
        </h2>
        <p class="text-center text-[9px] font-black uppercase tracking-[0.2em] text-[var(--mat-sys-primary)] mb-6">
            Update Password
        </p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            <div mat-dialog-content class="space-y-4 min-w-[280px]">
                <mat-form-field appearance="outline" class="w-full">
                    <mat-label>New Access Key</mat-label>
                    <input matInput formControlName="password" type="password" placeholder="••••••••">
                    <mat-error>
                        @if (form.get('password')?.hasError('required')) {
                            New Access Key is required
                        } @else if (form.get('password')?.hasError('minlength')) {
                            Minimum 6 characters required
                        }
                    </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                    <mat-label>Verify Key</mat-label>
                    <input matInput formControlName="confirmPassword" type="password" placeholder="••••••••">
                    <mat-error>
                        @if (isPasswordMismatch()) {
                            Keys do not match
                        }
                    </mat-error>
                </mat-form-field>
            </div>

            <div mat-dialog-actions align="end" class="flex gap-2 pt-4">
                <button mat-button type="button" (click)="cancel()">
                    Cancel
                </button>
                <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid" class="cursor-pointer">
                    Change Password
                </button>
            </div>
        </form>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdatePasswordDialogComponent {
    private dialogRef = inject(MatDialogRef<UpdatePasswordDialogComponent>);

    form = new FormGroup({
        password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
        confirmPassword: new FormControl('', { nonNullable: true })
    }, { validators: (group) => this.passwordMatchValidator(group) });

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { passwordMismatch: true };
        }
        return null;
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return !!(control && control.invalid && (control.touched || control.dirty));
    }

    isPasswordMismatch = computed(() => {
        return this.form.hasError('passwordMismatch') && 
               (this.form.get('confirmPassword')?.touched || this.form.get('confirmPassword')?.dirty);
    });

    submit() {
        if (this.form.invalid) return;
        this.dialogRef.close(this.form.getRawValue().password);
        this.form.reset();
    }

    cancel() {
        this.dialogRef.close(null);
        this.form.reset();
    }
}
