import MapView from 'react-native-maps';
import { isEqual } from 'lodash';

class PurePolyline extends MapView.Polyline {
  shouldComponentUpdate(nextProps) {
    return nextProps.strokeWidth !== this.props.strokeWidth ||
           nextProps.strokeColor !== this.props.strokeColor ||
           nextProps.onPress !== this.props.onPress ||
           !isEqual(nextProps.coordinates, this.props.coordinates);
  }
}

export default PurePolyline;
