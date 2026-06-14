import { patchState, signalStoreFeature, type, withHooks } from "@ngrx/signals";
import { inject, isDevMode } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthState } from "./auth-store";
import { AUTH_REPOSITORY_TOKEN } from "@boa/core-auth-domain";

export function withAuthSync() {
    return signalStoreFeature(
        { state: type<AuthState>() },
        withHooks({
            onInit(store, repo = inject(AUTH_REPOSITORY_TOKEN)) {
                console.log(`%c Powered by JamesMartland DDD Angular Architecture Suite `, `background: #222; color: #bada55; padding: 4px;border-radius: 4px; font-weight: bold;`);
                console.log('AuthSync: Initializing');

                repo.authState().pipe(takeUntilDestroyed()).subscribe({
                    next: (user) => {
                        const status = user ? 'authenticated' : 'unauthenticated';
                        if(isDevMode()) {
                            console.log('AuthSync: State Change Detected', { status, user });
                        }
                        patchState(store, {
                            user,
                            status,
                            error: null
                        });
                    },
                    error: (error) => {
                        console.error('Auth sync error:', error);
                        patchState(store, { status: 'unauthenticated', error: error.message });
                    }
                });
            }
        })
    );
}

