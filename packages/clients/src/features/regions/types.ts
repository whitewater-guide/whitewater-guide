import { Region } from '@whitewater-guide/commons';

import { WithNode } from '../../apollo';

export interface WithRegion {
  region: WithNode<Region | null>;
}
