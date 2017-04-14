import PropTypes from 'prop-types';
import React from 'react';
import GoogleMap from './GoogleMap';

export class Map extends React.Component {
  static propTypes = {
    initialBounds: PropTypes.object,
  };

  static defaultProps = {
    initialBounds: null,
  };

  onLoaded = ({ map, maps }) => {
    if (this.props.initialBounds) {
      const bounds = new maps.LatLngBounds(this.props.initialBounds.sw, this.props.initialBounds.ne);
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
