import { RegionsState } from '../ww-clients/features/regions';

interface PersistentState {
  regions: RegionsState;
}

// interface TransientState {
// }

export interface RootState {
  persistent: PersistentState;
  // transient: TransientState;
}
