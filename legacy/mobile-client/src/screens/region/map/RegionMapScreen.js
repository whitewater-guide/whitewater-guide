import { compose, setStatic, flattenProp } from 'recompose';
import { LoadingPlug } from '../../../components';
import { MapLayout, MapMobile, SelectedPOIView } from '../../../components/map';
import { RegionMapView } from '../../../commons/features/regions';
import SelectedSectionView from './SelectedSectionView';
import I18n from '../../../i18n';

export default compose(
  setStatic('navigationOptions', { tabBarLabel: I18n.t('region.map.title') }),
  flattenProp('screenProps'),
)(
  RegionMapView(MapLayout('regionScreen', true), MapMobile, SelectedSectionView, SelectedPOIView, LoadingPlug),
);
