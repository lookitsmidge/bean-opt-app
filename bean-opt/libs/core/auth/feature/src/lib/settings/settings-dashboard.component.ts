import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { AuthStore, ProfileStore } from "@boa/core-auth-application";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { UpdatePasswordDialogService } from "./update-password-dialog.service";

@Component({
    selector: 'lib-settings-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterModule],
    templateUrl: './settings-dashboard.component.html',
    providers: [UpdatePasswordDialogService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsDashboardComponent {
    protected authStore = inject(AuthStore);
    protected profileStore = inject(ProfileStore);
    protected passwordDialog = inject(UpdatePasswordDialogService);
    private router = inject(Router);
    protected imageError = signal(false);

    async clearCache() {
        const confirmed = confirm(
            'Purge Local Cache\n\nThis will purge your local cache and force a re-synchronization. Continue?'
        );

        if (confirmed) {
            localStorage.clear();
            alert('Local cache has been cleared successfully.');
        }
    }

    async updatePassword() {
        const newPassword = await this.passwordDialog.open();
        if (newPassword) {
            try {
                await this.authStore.updatePassword(newPassword);
                alert('Access Key successfully modified.');
            } catch (e: any) {
                // Error already handled in store but we can re-throw or handle here
            }
        }
    }

    async logout() {
        const confirmed = confirm(
            'Terminate Session\n\nAre you sure you want to log out of the secure archival protocol?'
        );

        if (confirmed) {
            await this.authStore.logout();
            this.router.navigate(['/auth']);
        }
    }

    async deleteAccount() {
        const confirmed = confirm(
            'Deconstruct Archive\n\nWARNING: This will permanently destroy your archive and profile metadata. This action is irreversible. Proceed?'
        );

        if (confirmed) {
            try {
                await this.profileStore.deleteAccount();
                this.router.navigate(['/auth']);
            } catch (e) {
                // Error already handled/alerted in command
            }
        }
    }
}


