import { signalStore, withState } from '@ngrx/signals';
import { Setup } from '@boa/features/equipment/domain';
import { withSetupSync } from './setup.sync';
import { withSetupCommands } from './setup.commands';

export interface SetupState {
  items: Setup[];
  loading: boolean;
  error: string | null;
}

const initialState: SetupState = {
  items: [],
  loading: false,
  error: null,
};

export const SetupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withSetupSync(),
  withSetupCommands(),
);
