import isEqual from 'lodash/isEqual';
import { MapPolylineProps, Polyline } from 'react-native-maps';

export default class PurePolyline extends Polyline {
  shouldComponentUpdate(nextProps: MapPolylineProps) {
    return nextProps.strokeWidth !== this.props.strokeWidth ||
           nextProps.strokeColor !== this.props.strokeColor ||
           nextProps.onPress !== this.props.onPress ||
           !isEqual(nextProps.coordinates, this.props.coordinates);
  }
}
