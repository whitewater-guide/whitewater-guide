import { mapProps } from 'recompose';
import { LoadingPlug } from '../../../components';
import { RegionMapView } from '../../../commons/features/regions';
import RegionMapLayout from './RegionMapLayout';
import MapOfRegionMobile from './MapOfRegionMobile';

export default mapProps(
  ({ screenProps, ...props }) => ({ ...props, ...screenProps }),
)(RegionMapView(RegionMapLayout, MapOfRegionMobile, () => null, LoadingPlug));
