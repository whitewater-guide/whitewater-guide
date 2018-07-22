import { NamedNode, Node, Timestamped } from '../../core';
import { Gauge } from '../gauges';
import { HarvestStatus } from '../measurements';
import { Region } from '../regions';
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
  status: HarvestStatus | null;
}

export interface SourceInput {
  id: string | null;
  name: string;
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  harvestMode: HarvestMode;
  url: string | null;
  regions: Node[];
}
