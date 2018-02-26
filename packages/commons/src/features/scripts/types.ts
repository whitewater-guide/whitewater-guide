import { NamedNode } from '../../core';
import { HarvestMode } from '../sources';

export interface Script extends NamedNode {
  harvestMode: HarvestMode;
  error: string | null;
}
