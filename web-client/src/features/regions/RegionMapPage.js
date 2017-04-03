import { compose } from 'recompose';
import { spinnerWhileLoading } from '../../core/components';
import { ViewSection } from '../sections';
import { withRegion, RegionMapView } from '../../commons/features/regions';
import { withSections } from '../../commons/features/sections';
import RegionMapLayout from './RegionMapLayout';
import MapOfRegionWeb from './MapOfRegionWeb';

export default compose(
  withRegion({ withBounds: true, withPOIs: false }),
  withSections({ withGeo: true }),
  spinnerWhileLoading(props => props.regionLoading),
)(RegionMapView(RegionMapLayout, MapOfRegionWeb, ViewSection));
