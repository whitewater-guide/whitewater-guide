import { compose, setStatic, flattenProp } from 'recompose';
import { LoadingPlug } from '../../../components';
import { MapLayout, MapMobile, SelectedPOIView } from '../../../components/map';
import { RegionMapView } from '../../../commons/features/regions';
import SelectedSectionView from './SelectedSectionView';

export default compose(
  setStatic('navigationOptions', { tabBarLabel: 'Map' }),
  flattenProp('screenProps'),
)(
  RegionMapView(MapLayout('RegionMap'), MapMobile, SelectedSectionView, SelectedPOIView, LoadingPlug),
);
