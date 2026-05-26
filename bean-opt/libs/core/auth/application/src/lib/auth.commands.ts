import { patchState, signalStoreFeature, type, withMethods } from "@ngrx/signals";
import { inject } from "@angular/core";
import { AuthState } from "./auth-store";
import { AUTH_REPOSITORY_TOKEN } from "@boa/core-auth-domain";

export function withAuthCommands() {
    return signalStoreFeature(
        { state: type<AuthState>() },
        withMethods((store, repo = inject(AUTH_REPOSITORY_TOKEN)) => ({
            async loginWithGoogle() {
                try {
                    patchState(store, { status: 'loading', error: null });
                    await repo.loginWithGoogle();
                } catch (e: any) {
                    patchState(store, { status: 'unauthenticated', error: e.message });
                    throw e;
                }
            },

            async login(email: string, password: string) {
                try {
                    patchState(store, { status: 'loading', error: null });
                    await repo.login(email, password);
                } catch (e: any) {
                    patchState(store, { status: 'unauthenticated', error: e.message });
                }
            },

            async signUp(email: string, password: string, displayName: string, privacyPolicyAccepted: boolean) {
                try {
                    patchState(store, { status: 'loading', error: null });
                    await repo.signUp(email, password, displayName, privacyPolicyAccepted);
                    
                    // Manually update the signal if it was already set by the sync hook but missing the displayName
                    const currentUser = store.user();
                    if (currentUser && !currentUser.displayName) {
                        patchState(store, { user: { ...currentUser, displayName } });
                    }
                } catch (e: any) {
                    patchState(store, { status: 'unauthenticated', error: e.message });
                }
            },

            async continueAsGuest() {
                try {
                    patchState(store, { status: 'loading', error: null });
                    await repo.continueAsGuest();
                } catch (e: any) {
                    patchState(store, { status: 'unauthenticated', error: e.message });
                }
            },

            async logout() {
                try {
                    await repo.logout();
                    patchState(store, { user: null, status: 'unauthenticated' });
                    // Full window reload to ensure all in-memory state is wiped
                    try {
                        window.location.assign('/auth');
                    } catch (e) {
                        // Suppress JSDOM navigation error in tests
                    }
                } catch (e: any) {
                    patchState(store, { error: e.message });
                }
            },

            async deleteAccount() {
                try {
                    patchState(store, { status: 'loading', error: null });
                    await repo.deleteAccount();
                } catch (e: any) {
                    patchState(store, { status: 'authenticated', error: e.message });
                    throw e;
                }
            },

            async updatePassword(newPassword: string) {
                try {
                    patchState(store, { error: null });
                    await repo.updatePassword(newPassword);
                } catch (e: any) {
                    patchState(store, { error: e.message });
                    throw e;
                }
            },

            toggleAdminMode() {
                patchState(store, { isAdminMode: !store.isAdminMode() });
            }
        }))
    );
}

