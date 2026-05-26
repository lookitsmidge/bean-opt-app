import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from '@boa/core-auth-application';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from "rxjs";

/** Guard to control access to users that are "logged in" to the system either with an account or as a guest */
export const IsAuthenticatedAuthGuard: CanActivateFn = (route, state) => {
    const store = inject(AuthStore);
    const router = inject(Router);

    // Converting Signal to an observable so that we can use RxJs to wait
    return toObservable(store.status).pipe(
        // Wait until checking is completed
        filter(status => status !== 'loading'),

        // Take the first definitive answer
        take(1),

        // Decide if authorised
        map(status => {
            // const user = store.user();
            // const isAnonymous = user?.isAnonymous ?? true;

            if (status === 'authenticated') {
                return true;
            }

            // Access Denied (or Anonymous) - Redirect to auth
            return router.createUrlTree(['/auth'], {
                queryParams: { returnUrl: state.url }
            });
        })
    )
}
