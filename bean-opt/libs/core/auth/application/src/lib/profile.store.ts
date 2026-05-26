import { signalStore, withState } from '@ngrx/signals';
import { CollectorProfile } from '@boa/core-auth-domain';
import { withProfileSync } from './profile.sync';
import { withProfileCommands } from './profile.commands';

export type ProfileSyncStatus = 'idle' | 'syncing' | 'ready' | 'error';

export interface ProfileState {
    profile: CollectorProfile | null;
    syncStatus: ProfileSyncStatus;
    handleAvailable: boolean | null;
    error: string | null;
}

const initialState: ProfileState = {
    profile: null,
    syncStatus: 'idle',
    handleAvailable: null,
    error: null
};

export const ProfileStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withProfileSync(),
    withProfileCommands()
);

