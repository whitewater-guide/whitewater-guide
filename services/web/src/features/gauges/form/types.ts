import { Coordinate3d, GaugeInput, Overwrite } from '@whitewater-guide/commons';

export interface RouterParams {
  sourceId: string;
  gaugeId?: string;
}

export interface GaugeLocationForm {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  coordinates: Coordinate3d | null;
  kind?: string;
}

export type GaugeFormData = Overwrite<
  GaugeInput<string | null>,
  { location: GaugeLocationForm | null }
>;
