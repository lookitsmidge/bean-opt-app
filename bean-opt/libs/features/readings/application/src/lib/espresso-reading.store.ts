import { signalStore, withState } from '@ngrx/signals';
import { EspressoReading } from '@boa/features/readings/domain';
import { withEspressoReadingSync } from './espresso-reading.sync';
import { withEspressoReadingCommands } from './espresso-reading.commands';

export interface EspressoReadingState {
  items: EspressoReading[];
  loading: boolean;
  error: string | null;
}

const initialState: EspressoReadingState = {
  items: [],
  loading: false,
  error: null,
};

export const EspressoReadingStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEspressoReadingSync(),
  withEspressoReadingCommands(),
);
