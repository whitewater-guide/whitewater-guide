import { Gauge } from '@whitewater-guide/commons';

export type ListedGauge = Pick<
  Gauge,
  'id' | 'name' | 'code' | 'levelUnit' | 'flowUnit' | 'lastMeasurement'
>;
