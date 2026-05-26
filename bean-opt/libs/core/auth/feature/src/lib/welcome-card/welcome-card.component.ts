import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { CollectorProfile } from '@boa/core-auth-domain';

/** Component to provide a look into who has just logged into the system - providing a continue button, and a logout button */
@Component({
    selector: 'lib-welcome-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './welcome-card.component.html',
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .animate-in { animation: slideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeCardComponent {
    profile = input<CollectorProfile | null>(null); // Should be a collector profile
    isGuest = input<boolean>();
    logout = output<void>();
    enter = output<void>();

}
