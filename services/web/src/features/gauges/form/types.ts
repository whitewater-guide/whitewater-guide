import {
  CoordinateLoose,
  GaugeInput,
  Overwrite,
} from '@whitewater-guide/commons';

export interface RouterParams {
  sourceId: string;
  gaugeId?: string;
}

export interface GaugeLocationForm {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  coordinates: CoordinateLoose | null;
  kind?: string;
}

export type GaugeFormData = Overwrite<
  GaugeInput<string | null>,
  { location: GaugeLocationForm | null }
>;
