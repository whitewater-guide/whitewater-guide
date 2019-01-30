import { Overwrite } from 'type-zoo';
import { NamedNode, Node, Timestamped } from '../../core';
import { Gauge } from '../gauges';
import { HarvestMode } from '../harvest-mode';
import { HarvestStatus } from '../measurements';
import { Region } from '../regions';
import { Script } from '../scripts';
import { Connection } from '../types';

export interface Source extends NamedNode, Timestamped {
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  harvestMode: HarvestMode;
  url: string | null;
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

export type SourceFormInput<RichText = any> = Overwrite<
  SourceInput,
  { termsOfUse: RichText; script: Script }
>;
