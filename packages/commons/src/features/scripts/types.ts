import { NamedNode } from '../../apollo';
import { HarvestMode } from '../harvest-mode';

export interface Script extends NamedNode {
  harvestMode: HarvestMode;
}
