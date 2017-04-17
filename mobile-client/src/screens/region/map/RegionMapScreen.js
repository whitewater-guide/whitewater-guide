import { flattenProp } from 'recompose';
import { LoadingPlug } from '../../../components';
import { MapLayout, MapMobile } from '../../../components/map';
import { RegionMapView } from '../../../commons/features/regions';
import SelectedSectionView from './SelectedSectionView';

export default flattenProp('screenProps')(
  RegionMapView(MapLayout, MapMobile, SelectedSectionView, () => null, LoadingPlug),
);
