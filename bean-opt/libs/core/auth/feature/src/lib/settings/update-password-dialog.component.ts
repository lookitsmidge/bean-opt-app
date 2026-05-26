import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { UpdatePasswordDialogService } from "./update-password-dialog.service";

@Component({
    selector: 'lib-update-password-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    @if (vs.isOpen()) {
        <div class="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div class="w-full max-w-sm rounded-[2.5rem] bg-white p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                
                <div class="text-center mb-8">
                    <h3 class="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Modify Access</h3>
                    <p class="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-2">Update Archival Security Key</p>
                </div>

                <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
                    <div class="space-y-1">
                        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">New Access Key</span>
                        <input formControlName="password" type="password" placeholder="••••••••"
                            [class.border-rose-500]="isFieldInvalid('password')"
                            class="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all">
                    </div>

                    <div class="space-y-1">
                        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Verify Key</span>
                        <input formControlName="confirmPassword" type="password" placeholder="••••••••"
                            [class.border-rose-500]="isPasswordMismatch()"
                            class="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all">
                        @if (isPasswordMismatch()) {
                            <p class="text-[8px] font-black uppercase tracking-widest text-red-500 ml-4 mt-1">Keys do not match</p>
                        }
                    </div>

                    <div class="mt-10 flex gap-3">
                        <button type="button" (click)="cancel()"
                            class="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                        <button type="submit" [disabled]="form.invalid"
                            class="flex-[2] rounded-[1.5rem] bg-slate-900 px-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 active:scale-95 transition-all hover:bg-indigo-600 disabled:opacity-50">
                            Sync New Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdatePasswordDialogComponent {
    vs = inject(UpdatePasswordDialogService);

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
        this.vs.close(this.form.getRawValue().password);
        this.form.reset();
    }

    cancel() {
        this.vs.close(null);
        this.form.reset();
    }
}
