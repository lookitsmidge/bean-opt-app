import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthUser, ShellNavigationButton, ShellNavigationDisplayMode } from './shell';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatMenuModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: contents;'
  }
})
export class SidebarComponent {
  /** The source URL path of the logo image. */
  logoSrc = input<string>();

  /** The authenticated user profile. */
  user = input<AuthUser | null>(null);

  /** Full set of configured navigation buttons for the application. */
  navButtons = input<ShellNavigationButton[]>([]);

  /** Checks if the user has admin role access. */
  isAdmin = input<boolean>(false);

  /** Checks if admin interface features are currently visible. */
  isAdminModeActive = input<boolean>(false);

  /** Event triggered when user clicks logout. */
  logoutRequested = output<void>();

  /** Event triggered when admin toggles views. */
  adminToggleRequested = output<void>();

  /** Collapsed toggle state of the desktop sidebar menu. */
  isCollapsed = signal(false);

  /** Computes the filtered list of buttons to display in the desktop sidebar. */
  desktopButtons = computed(() => {
    const isAnon = this.user()?.isAnonymous ?? true;
    return this.navButtons().filter(b => {
      const authOk = b.showForAnonymous || !isAnon;
      const displayOk = b.displayMode !== ShellNavigationDisplayMode.SHOW_ON_MOBILE;
      return authOk && displayOk;
    });
  });

  /** Computes the filtered list of buttons to display in the mobile bottom bar. */
  mobileButtons = computed(() => {
    const isAnon = this.user()?.isAnonymous ?? true;
    return this.navButtons().filter(b => {
      const authOk = b.showForAnonymous || !isAnon;
      const displayOk = b.displayMode !== ShellNavigationDisplayMode.SHOW_ON_DESKTOP;
      return authOk && displayOk;
    });
  });

  /** Toggles the collapse/expand state of the desktop sidebar. */
  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }
}
