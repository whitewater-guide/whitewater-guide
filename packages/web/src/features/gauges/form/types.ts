import type {
  GaugeInput,
  NamedNode,
  PointInput,
} from '@whitewater-guide/schema';
import type { Overwrite } from 'utility-types';

export interface RouterParams {
  sourceId: string;
  gaugeId?: string;
}

export type GaugeFormData = Overwrite<
  GaugeInput,
  {
    location: PointInput | null;
    requestParams?: string | null;
    timezone?: NamedNode | null;
  }
>;
