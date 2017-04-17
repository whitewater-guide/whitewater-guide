import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import MapView from 'react-native-maps';
import { SectionPropType } from '../../commons/features/sections';

const Anchor = { x: 0.5, y: 0.5 };

class SimpleSection extends React.PureComponent {
  static propTypes = {
    section: SectionPropType.isRequired,
    selected: PropTypes.bool,
    onSectionSelected: PropTypes.func.isRequired,
    zoom: PropTypes.number.isRequired,
  };

  static defaultProps = {
    selected: false,
  };

  renderArrow = () => {
    const { section, selected, zoom } = this.props;
    const {
      putIn: { coordinates: [putInLng, putInLat] },
      takeOut: { coordinates: [takeOutLng, takeOutLat] },
    } = section;
    if (zoom < 3) {
      return null;
    }
    const rotate = 180 * Math.atan2(putInLat - takeOutLat, takeOutLng - putInLng) / Math.PI;
    const scale = Math.min(1, (zoom - 3) / 8);
    return (
      <MapView.Marker
        anchor={Anchor}
        coordinate={{ longitude: takeOutLng, latitude: takeOutLat }}
      >
        <Svg width={24} height={24}>
          <Polygon
            originX="12"
            originY="12"
            points="7,7 22,12 7,17"
            rotate={rotate}
            scale={scale}
            fill={selected ? 'red' : 'black'}
          />
        </Svg>
      </MapView.Marker>
    );
  };

  render() {
    const { section, selected, onSectionSelected, zoom } = this.props;
    const {
      putIn: { coordinates: [putInLng, putInLat] },
      takeOut: { coordinates: [takeOutLng, takeOutLat] },
    } = section;
    const coordinates = [
      { latitude: putInLat, longitude: putInLng },
      { latitude: takeOutLat, longitude: takeOutLng },
    ];
    return (
      <View>
        <MapView.Polyline
          strokeWidth={3}
          strokeColor={selected ? 'red' : 'black'}
          onPress={() => onSectionSelected(section)}
          coordinates={coordinates}
        />
        { this.renderArrow() }
      </View>
    );
  }
}


export default SimpleSection;
