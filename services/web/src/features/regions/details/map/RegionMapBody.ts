import { MapBody } from '@whitewater-guide/clients';
import { Map, SectionLine } from '../../../../components/maps';

const RegionMapBody = MapBody(
  Map,
  SectionLine,
  () => null,
  () => ({}),
  () => ({}),
);

export default RegionMapBody;
