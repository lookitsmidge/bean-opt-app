import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { AuthUser } from "@boa/core-auth-domain";

@Component({
    selector: 'lib-auth-profile-snippet',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage],
    templateUrl: './profile-snippet.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSnippetComponent {
    user = input<AuthUser | null>(null);
    isCollapsed = input<boolean>(false);
    mini = input<boolean>(false);

    userInitials = computed(() => {
        if (this.user()?.isAnonymous) return '??';
        const name = this.user()?.displayName || 'Archivist';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    });
}

