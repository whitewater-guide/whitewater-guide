import {
  Connection,
  NamedNode,
  Node,
  NodeRef,
  Timestamped,
} from '../../apollo';

import { Gauge } from '../gauges';
import { HarvestStatus } from '../measurements';
import { Region } from '../regions';

export interface Source<RP = any> extends NamedNode, Timestamped {
  termsOfUse: string | null;
  script: string;
  requestParams: RP;
  cron: string | null;
  url: string | null;
  enabled: boolean | null;
  // --- connections
  regions?: Connection<Region>;
  gauges?: Connection<Gauge>;
  status: HarvestStatus | null;
}

export interface SourceInput<RP = any> {
  id: string | null;
  name: string;
  termsOfUse: string | null;
  script: string;
  cron: string | null;
  requestParams: RP;
  url: string | null;
  regions: NodeRef[];
}

export const isSource = (node?: Node | null): node is Source =>
  !!node && node.__typename === 'Source';
