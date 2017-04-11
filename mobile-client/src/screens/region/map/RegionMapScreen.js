import { flattenProp } from 'recompose';
import { LoadingPlug } from '../../../components';
import { MapMobile } from '../../../components/map';
import { RegionMapView } from '../../../commons/features/regions';
import RegionMapLayout from './RegionMapLayout';

export default flattenProp('screenProps')(
  RegionMapView(RegionMapLayout, MapMobile, () => null, () => null, LoadingPlug),
);
