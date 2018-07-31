import { NamedNode } from '../../core';
import { HarvestMode } from '../harvest-mode';

export interface Script extends NamedNode {
  harvestMode: HarvestMode;
  error: string | null;
}
