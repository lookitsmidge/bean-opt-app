import { signalStore, withState } from '@ngrx/signals';
import { CoffeeGrinder } from '@boa/features/equipment/domain';
import { withCoffeeGrinderSync } from './coffee-grinder.sync';
import { withCoffeeGrinderCommands } from './coffee-grinder.commands';

export interface CoffeeGrinderState {
  items: CoffeeGrinder[];
  loading: boolean;
  error: string | null;
}

const initialState: CoffeeGrinderState = {
  items: [],
  loading: false,
  error: null,
};

export const CoffeeGrinderStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCoffeeGrinderSync(),
  withCoffeeGrinderCommands(),
);
