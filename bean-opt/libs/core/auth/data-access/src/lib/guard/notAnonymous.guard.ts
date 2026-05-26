import { inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from '@boa/core-auth-application';
import { filter, map, take } from "rxjs";

export const NotAnonymousGuard: CanActivateFn = (route, state) => {
    const store = inject(AuthStore);
    const router = inject(Router);

    return toObservable(store.status).pipe(

        filter(status => status !== 'loading'),

        take(1),

        map(status => {
            const user = store.user();
            const isAnonymous = user?.isAnonymous ?? true;

            if (status === 'authenticated' && !isAnonymous) {
                return true;
            }

            // Access Denied (or Anonymous) - Redirect to auth
            return router.createUrlTree(['/auth'], { queryParams: { returnUrl: state.url } });
        })
    )
}
