import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './sidebar';
import { AuthUser } from '@boa/core-auth-domain'

export enum ShellNavigationDisplayMode {
  SHOW_ON_ALL = 'SHOW_ON_ALL',
  SHOW_ON_DESKTOP = 'SHOW_ON_DESKTOP',
  SHOW_ON_MOBILE = 'SHOW_ON_MOBILE'
}

export interface ShellNavigationButton {
  link: string;
  ariaLabel: string;
  svgName: string;
  showForAnonymous: boolean;
  displayMode?: ShellNavigationDisplayMode;
}

// export interface AuthUser {
//   displayName?: string;
//   email?: string;
//   photoUrl?: string;
//   isAnonymous?: boolean;
// }

@Component({
  selector: 'lib-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    SidebarComponent
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: block; -webkit-tap-highlight-color: transparent'
  }
})
export class Shell {
  /** The current active page title, used to update browser window titles. */
  pageTitle = input<string>("BeanOpt");

  /** The source URL path of the application logo image. */
  logoSrc = input<string>();

  /** Determines whether the header elements are displayed on screen. */
  showHeader = input<boolean>(true);

  /** The currently logged-in user profile, if authenticated. */
  user = input<AuthUser | null>(null);

  /** List of configuration objects mapping buttons inside navigation bars. */
  navButtons = input<ShellNavigationButton[]>([]);

  /** Flag showing if the current user possesses administrative permissions. */
  isAdmin = input<boolean>(false);

  /** Flag showing if the administrator mode is currently toggled on. */
  isAdminModeActive = input<boolean>(false);

  /** Triggers when the user requests to sign out. */
  logoutRequested = output<void>();

  /** Triggers when an administrator toggles their administrative view mode. */
  adminToggleRequested = output<void>();

  protected router = inject(Router);
  private titleService = inject(Title);

  constructor() {
    // Automatically update the document window title whenever the page title changes
    effect(() => {
      const title = this.pageTitle();
      this.titleService.setTitle(`${title} | BeanOpt`);
    });
  }
}
