import React, {PropTypes} from 'react';
import SectionLine from './SectionLine';
import GoogleMap from './GoogleMap';

export default class Map extends React.Component {
  static propTypes = {
    sections: PropTypes.array,
    bounds: PropTypes.object,
    selectedSectionId: PropTypes.string,
    onSectionSelected: PropTypes.func
  };

  render() {
    return (
      <GoogleMap onLoaded={this.onLoaded}>
        {this.props.sections.map(this.renderSection)}
      </GoogleMap>
    );
  }

  onLoaded = ({map, maps}) => {
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
        sectionId={section._id}
        onClick={this.onSectionClick}
        key={section._id}
        origin={section.putIn}
        destination={section.takeOut}
      />
    );
  };

  onSectionClick = (sectionId) => {
    this.props.onSectionSelected(sectionId);
  };

}
