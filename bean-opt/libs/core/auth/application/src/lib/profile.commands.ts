import { patchState, signalStoreFeature, type, withMethods } from "@ngrx/signals";
import { inject } from "@angular/core";
import { ProfileState } from "./profile.store";
import { PROFILE_REPOSITORY_TOKEN } from "@boa/core-auth-domain";
import { AuthStore } from "./auth-store";
import { CollectorProfile } from "@boa/core-auth-domain";

export function withProfileCommands() {
    return signalStoreFeature(
        { state: type<ProfileState>() },
        withMethods((store, repo = inject(PROFILE_REPOSITORY_TOKEN), auth = inject(AuthStore)) => ({
            async updateProfileData(updates: Partial<CollectorProfile>) {
                const user = auth.user();
                if (!user || user.isAnonymous) throw new Error('Unauthorised or Guest Session');

                try {
                    patchState(store, { syncStatus: 'syncing', error: null });
                    
                    // Optimistic Update: Update local state immediately for snappy UI
                    if (store.profile()) {
                        patchState(store, { profile: { ...store.profile()!, ...updates } });
                    }

                    await repo.updateProfile(user.uid, updates);
                    patchState(store, { syncStatus: 'ready' });
                } catch (e: any) {
                    patchState(store, { syncStatus: 'error', error: e.message });
                    throw e;
                }
            },

            async updateBio(newBio: string) {
                await this.updateProfileData({ bio: newBio });
            },

            async updateDisplayName(newDisplayName: string) {
                await this.updateProfileData({ displayName: newDisplayName });
            },

            async checkHandleAvailability(handle: string) {
                if (!handle) {
                    patchState(store, { handleAvailable: null });
                    return;
                }

                try {
                    const available = await repo.isHandleAvailable(handle);
                    patchState(store, { handleAvailable: available });
                } catch (e: any) {
                    patchState(store, { error: e.message });
                }
            },


            async deleteAccount() {
                const user = auth.user();
                if (!user || user.isAnonymous) throw new Error('Unauthorised or Guest Session');

                try {
                    patchState(store, { syncStatus: 'syncing', error: null });
                    await repo.deleteProfile(user.uid);
                    await auth.deleteAccount();
                    patchState(store, { profile: null, syncStatus: 'idle' });
                } catch (e: any) {
                    patchState(store, { syncStatus: 'error', error: e.message });
                    throw e;
                }
            }
        }))
    );
}

