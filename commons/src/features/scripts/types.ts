import { HarvestMode } from '../sources';

export interface Script {
  script: string;
  harvestMode: HarvestMode;
  error: string | null;
}
