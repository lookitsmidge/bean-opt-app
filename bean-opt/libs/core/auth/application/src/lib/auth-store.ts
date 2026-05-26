import { computed } from '@angular/core';
import { signalStore, withState, withComputed } from '@ngrx/signals';
import { AuthUser, AuthStatus } from '@boa/core-auth-domain';
import { withAuthSync } from './auth.sync';
import { withAuthCommands } from './auth.commands';

export interface AuthState {
    user: AuthUser | null;
    status: AuthStatus;
    error: string | null;
    isAdminMode: boolean;
}

const initialState: AuthState = {
    user: null,
    status: 'loading',
    error: null,
    isAdminMode: false
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withAuthSync(),
    withAuthCommands(),
    // Block 1: Basic Role Signals
    withComputed((store) => ({
        roles: computed(() => store.user()?.roles ?? []),
        rolesLoaded: computed(() => store.user()?.rolesLoaded ?? false),
        isAdmin: computed(() => store.user()?.roles.includes('admin') ?? false),
        isModerator: computed(() => store.user()?.roles.includes('moderator') ?? false)
    })),
    // Block 2: Dependent Signals (can now use store.isAdmin())
    withComputed((store) => ({
        adminModeActive: computed(() => store.isAdmin() && store.isAdminMode())
    }))
);
