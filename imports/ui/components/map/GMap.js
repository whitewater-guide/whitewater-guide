import React, {PropTypes, Children, cloneElement} from 'react';
import GoogleMap from 'google-map-react';
import {Meteor} from 'meteor/meteor';
import {compose, withState, withHandlers, flattenProp} from 'recompose';

const DEFAULT_CENTER = {lat: 0, lng: 0};
const DEFAULT_ZOOM = 3;

class GMap extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    map: PropTypes.object,
    maps: PropTypes.object,
    loaded: PropTypes.bool,
    onLoaded: PropTypes.func,
  };

  render() {
    const {map, maps, children, loaded, ...props} = this.props;
    return (
      <GoogleMap
        {...props}
        bootstrapURLKeys={{key: Meteor.settings.public.googleMaps.apiKey}}
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        yesIWantToUseGoogleMapApiInternals={true}
      >
        {loaded && Children.map(children, (child => cloneElement(child, { map, maps })))}
      </GoogleMap>
    );
  }
}

export default compose(
  withState('api', 'updateApi', {map: null, maps: null, loaded: false}),
  withHandlers({
    onGoogleApiLoaded: props => ({map, maps}) => {
      props.updateApi({map, maps, loaded: true});
      if (props.onLoaded){
        props.onLoaded({map, maps});
      }
    }
  }),
  flattenProp('api'),
)(GMap);