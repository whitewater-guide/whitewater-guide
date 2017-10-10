import { NamedResource } from '../../core';
import { HarvestMode } from '../sources';

export interface Script extends NamedResource {
  harvestMode: HarvestMode;
  error: string | null;
}
