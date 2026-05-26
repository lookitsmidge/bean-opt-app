import { computed, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '@boa/core-auth-application';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

/**
 * Functional guard to restrict access based on user roles.
 * @param role The role required to access the route.
 * @returns A CanActivateFn that checks if the user has the required role.
 */
export const roleGuard = (role: string): CanActivateFn => {
  return () => {
    const store = inject(AuthStore);
    const router = inject(Router);

    // Create a reactive state that combines status and role loading
    const authReady = computed(() => {
      const status = store.status();
      if (status === 'loading') return false;
      if (status === 'unauthenticated') return true;
      return store.rolesLoaded();
    });

    return toObservable(authReady).pipe(
      // Wait until the combined state is ready
      filter((ready) => ready),
      
      // Take the first definitive answer
      take(1),

      // Decide if authorised
      map(() => {
        const user = store.user();
        if (user && user.roles.includes(role)) {
          return true;
        }

        // Redirect to home if unauthorized
        return router.parseUrl('/');
      })
    );
  };
};
