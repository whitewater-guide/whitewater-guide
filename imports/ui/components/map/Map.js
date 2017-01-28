import React, {PropTypes} from 'react';
import SectionLine from './SectionLine';
import GMap from './GMap';

export default class Map extends React.Component {
  static propTypes = {
    sections: PropTypes.array,
    bounds: PropTypes.object,
  };

  render() {
    return (
      <GMap onLoaded={this.onLoaded}>
        {this.props.sections.map(this.renderSection)}
      </GMap>
    );
  }

  onLoaded = ({map, maps}) => {
    this.setState({map, maps, mapLoaded: true});
    if (this.props.bounds) {
      var bounds = new maps.LatLngBounds(this.props.bounds.sw, this.props.bounds.ne);
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

      //remove one zoom level to ensure no marker is on the edge.
      map.setZoom(map.getZoom() - 1);
    }
  };

  renderSection = (section) => {
    return (
      <SectionLine
        key={section._id}
        origin={section.putIn}
        destination={section.takeOut}
      />
    );
  };

}
