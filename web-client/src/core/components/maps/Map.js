import PropTypes from 'prop-types';
import React from 'react';
import GoogleMap from './GoogleMap';
import { arrayToGmaps } from '../../../commons/utils/GeoUtils';

export class Map extends React.Component {
  static propTypes = {
    initialBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  };

  static defaultProps = {
    initialBounds: null,
  };

  onLoaded = ({ map, maps }) => {
    const { initialBounds } = this.props;
    if (initialBounds) {
      const bounds = new maps.LatLngBounds();
      initialBounds.forEach(point => bounds.extend(arrayToGmaps(point)));
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

      // remove one zoom level to ensure no marker is on the edge.
      map.setZoom(map.getZoom() - 1);
    }
  };

  render() {
    return (
      <GoogleMap onLoaded={this.onLoaded}>
        { this.props.children }
      </GoogleMap>
    );
  }

}
