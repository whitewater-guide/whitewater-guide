import React, {PropTypes} from 'react';
import GoogleMap from 'google-map-react';
import {Meteor} from 'meteor/meteor';
import SectionLine from './SectionLine';

export default class Map extends React.Component {
  static propTypes = {
    sections: PropTypes.array,
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
        defaultCenter={{lat: 59.938043, lng: 30.337157}}
        defaultZoom={9}
        onGoogleApiLoaded={({map, maps}) => this.setState({map, maps, mapLoaded: true})}
        yesIWantToUseGoogleMapApiInternals={true}
      >
        {this.state.mapLoaded && this.props.sections.map(this.renderSection)}
      </GoogleMap>
    );
  }

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
