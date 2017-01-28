import React, {PropTypes} from 'react';
import GoogleMap from 'google-map-react';
import {Meteor} from 'meteor/meteor';
import SectionLine from './SectionLine';

const DEFAULT_CENTER = {lat: 0, lng: 0};
const DEFAULT_ZOOM = 9;

export default class Map extends React.Component {
  static propTypes = {
    sections: PropTypes.array,
    bounds: PropTypes.object,
  };

  state = {
    map: null,
    maps: null,
    mapLoaded: false,
  };

  render() {
    return (
      <GoogleMap
        bootstrapURLKeys={{key: Meteor.settings.public.googleMaps.apiKey}}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        onGoogleApiLoaded={this.onApiLoaded}
        yesIWantToUseGoogleMapApiInternals={true}
      >
        {this.state.mapLoaded && this.props.sections.map(this.renderSection)}
      </GoogleMap>
    );
  }

  onApiLoaded = ({map, maps}) => {
    this.setState({map, maps, mapLoaded: true});
    if (this.props.bounds){
      var bounds = new maps.LatLngBounds(this.props.bounds.sw, this.props.bounds.ne);
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

      //remove one zoom level to ensure no marker is on the edge.
      map.setZoom(map.getZoom()-1);
    }
  };

  renderSection = (section) => {
    return (
      <SectionLine
        key={section._id}
        map={this.state.map}
        maps={this.state.maps}
        origin={section.putIn}
        destination={section.takeOut}
      />
    );
  };

}
