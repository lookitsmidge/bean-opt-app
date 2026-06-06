import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@boa/core-auth-application';
import { Shell, ShellNavigationButton } from '@boa/core-ui';

export const SHELL_NAV_BUTTONS: ShellNavigationButton[] = [
  {
    link: '/dashboard',
    ariaLabel: 'Dashboard',
    svgName: 'home',
    showForAnonymous: true,
  },
  {
    link: '/optimizations',
    ariaLabel: 'Optimizations',
    svgName: 'tune',
    showForAnonymous: false,
  },
  {
    link: '/readings',
    ariaLabel: 'Readings',
    svgName: 'insights',
    showForAnonymous: false,
  }
]

@Component({
  imports: [ RouterModule, Shell],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'BeanOpt Web';
  protected readonly auth = inject(AuthStore);

  // private routeSnapshotData = toSignal()
  protected shellNavigationButtons = computed(() => {
    const isAnonymous = false; // TODO: get from auth state

    const buttons = SHELL_NAV_BUTTONS.filter(btn => {
      if (isAnonymous)  return btn.showForAnonymous;
      return true;
    });

    // Add admin buttons if user is in admin mode

    return buttons;
  })
}
