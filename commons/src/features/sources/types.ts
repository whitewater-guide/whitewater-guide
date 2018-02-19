import { NamedNode, Timestamped } from '../../core';
import { Node } from '../../core/types';
import { Gauge } from '../gauges/types';
import { Region } from '../regions/types';
import { Connection } from '../types';

export enum HarvestMode {
  ALL_AT_ONCE = 'allAtOnce',
  ONE_BY_ONE = 'oneByOne',
}

export interface Source extends NamedNode, Timestamped {
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  harvestMode: HarvestMode;
  url: string | null;
  enabled: boolean | null;
  // --- connections
  regions?: Connection<Region>;
  gauges?: Connection<Gauge>;
}

export class SourceInput {
  id: string | null;
  name: string;
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  harvestMode: HarvestMode;
  url: string | null;
  regions: Node[];
}
