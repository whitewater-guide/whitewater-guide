import { GrapqhlResource, Timestamped } from '../../core';

export enum HarvestMode {
  ALL_AT_ONCE = 'allAtOnce',
  ONE_BY_ONE = 'oneByOne',
}

export interface Source extends GrapqhlResource, Timestamped {
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  harvestMode: HarvestMode;
  url: string | null;
  enabled: boolean | null;
}

export class SourceInput {
  id: string | null;
  name: string;
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  harvestMode: HarvestMode;
  enabled: boolean | null;
  url: string | null;
}
