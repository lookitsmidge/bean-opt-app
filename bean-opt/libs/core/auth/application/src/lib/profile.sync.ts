import { patchState, signalStoreFeature, type, withHooks, withMethods } from "@ngrx/signals";
import { effect, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, tap, switchMap, catchError, of } from "rxjs";
import { ProfileState } from "./profile.store";
import { PROFILE_REPOSITORY_TOKEN, AuthUser, CollectorProfile } from "@boa/core-auth-domain";
import { AuthStore } from "./auth-store";

export function withProfileSync() {
    return signalStoreFeature(
        { state: type<ProfileState>() },
        withMethods((store, repo = inject(PROFILE_REPOSITORY_TOKEN)) => ({
            /** Load the profile into the store */
            loadProfile: rxMethod<string>(
                pipe(
                    tap(() => patchState(store, { syncStatus: 'syncing', error: null })),
                    switchMap((uid) => repo.getProfile(uid).pipe(
                        tap((profile) => {
                            if (profile) {
                                patchState(store, { profile, syncStatus: 'ready' });
                            } else {
                                patchState(store, { profile: null, syncStatus: 'idle' });
                            }
                        }),
                        catchError((error) => {
                            console.error('Profile sync error:', error);
                            patchState(store, { syncStatus: 'error', error: error.message });
                            return of(null);
                        })
                    ))
                )
            ),

            async createInitialProfile(user: AuthUser) {
                try {
                    const rawName = user.displayName;
                    const fallbackName = user.email ? user.email.split('@')[0] : 'Collector';
                    const displayName = rawName || fallbackName;

                    const cleanName = displayName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const randomTag = Math.floor(1000 + Math.random() * 9000);
                    const generatedHandle = `${cleanName}_${randomTag}`;

                    const newProfile: CollectorProfile = {
                        uid: user.uid,
                        displayName: displayName,
                        handle: generatedHandle,
                        photoUrl: user.photoUrl || '',
                        bio: '',
                        stats: { totalCollected: 0, followers: 0 },
                        roles: [],
                        isBanned: false,
                        privacyPolicyAcceptedAt: user.privacyPolicyAcceptedAt
                    };

                    await repo.createProfile(newProfile);
                } catch (e: any) {
                    patchState(store, { syncStatus: 'error', error: e.message });
                }
            },

            /** Clears the local state */
            clear: () => patchState(store, { profile: null, syncStatus: 'idle' })
        })),
        withHooks({
            onInit(store, auth = inject(AuthStore)) {
                effect(async () => {
                    const user = auth.user();
                    if (user && !user.isAnonymous) {
                        store.loadProfile(user.uid);
                    } else {
                        store.clear();
                    }
                });

                // Auto-creation logic
                effect(async () => {
                    const user = auth.user();
                    const status = store.syncStatus();
                    const profile = store.profile();
                    const authStatus = auth.status();

                    if (authStatus === 'authenticated' && user && !user.isAnonymous && status === 'idle' && profile === null) {
                        console.log('ProfileStore: Profile not found, creating new profile...');
                        await store.createInitialProfile(user);
                        store.loadProfile(user.uid);
                    }
                });
            }
        })
    );
}

