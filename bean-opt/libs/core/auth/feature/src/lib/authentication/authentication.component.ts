import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthStore, ProfileStore } from "@boa/core-auth-application";
import { LoginFormComponent } from "../login-form/login-form.component";

@Component({
    selector: 'lib-auth-feature',
    standalone: true,
    imports: [CommonModule, LoginFormComponent, RouterModule],
    templateUrl: './authentication.component.html',
    styles: [
        ':host { display: flex; flex-direction: column; flex: 1; width: 100%}',
        '.animate-float { animation: float 6s ease-in-out infinite }',
        '@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }',
        '.input-focus:focus { box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationComponent {
    protected authStore = inject(AuthStore);
    protected profileStore = inject(ProfileStore);
    private router = inject(Router);

    constructor() {
        effect(() => {
            const status = this.authStore.status();
            // Automatically initialize dashboard for any authenticated session (Guest or Registered)
            if (status === 'authenticated') {
                this.router.navigate(['/home']);
            }
        });
    }

    public mode = signal<'login' | 'signup'>('login');

    handleAuth(credentials: { email: string, password: string, displayName: string, privacyPolicyAccepted: boolean }) {
        if (this.mode() === 'login') {
            this.authStore.login(credentials.email, credentials.password);
        } else {
            this.authStore.signUp(credentials.email, credentials.password, credentials.displayName, credentials.privacyPolicyAccepted);
        }
    }

    handleGoogleLogin() {
        this.authStore.loginWithGoogle();
    }

    /** Method to continue anonymously */
    async onGuestLogin() {
        await this.authStore.continueAsGuest();
    }

    onLogin = () => this.router.navigate(['/home']);


}
