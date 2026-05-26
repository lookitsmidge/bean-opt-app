import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthUser } from "@boa/core-auth-domain";

@Component({
    selector: 'lib-auth-profile-menu',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './profile-menu.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileMenuComponent {
    user = input<AuthUser | null>(null);
    align = input<'left' | 'right' | 'top'>('right');
    
    /** Whether to show the admin toggle (only for admins) */
    showAdminToggle = input<boolean>(false);
    /** Current state of admin mode */
    isAdminModeActive = input<boolean>(false);

    logoutRequested = output<void>();
    /** Emitted when the user wants to toggle admin mode */
    adminToggleRequested = output<void>();

    private eRef = inject(ElementRef);

    isOpen = signal(false);

    toggleMenu(event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.isOpen.update(v => !v);
    }

    closeMenu() {
        this.isOpen.set(false);
    }

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (!this.eRef.nativeElement.contains(event.target)) {
            this.closeMenu();
        }
    }

    async onLogout() {
        this.logoutRequested.emit();
        this.closeMenu();
    }
}

