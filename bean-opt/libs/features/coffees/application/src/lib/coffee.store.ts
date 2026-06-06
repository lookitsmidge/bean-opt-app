import { signalStore, withState } from '@ngrx/signals';
import { Coffee } from '@boa/features/coffees/domain';
import { withCoffeeSync } from './coffee.sync';
import { withCoffeeCommands } from './coffee.commands';

export interface CoffeeState {
  items: Coffee[];
  loading: boolean;
  error: string | null;
}

const initialState: CoffeeState = {
  items: [],
  loading: false,
  error: null,
};

export const CoffeeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCoffeeSync(),
  withCoffeeCommands(),
);
