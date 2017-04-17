import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import MapView from 'react-native-maps';
import { SectionPropType } from '../../commons/features/sections';

const Anchor = { x: 0.5, y: 0.5 };
const dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  callout: {
    width: Math.round(0.66 * dimensions.width),
  },
  calloutMarker: {
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
});

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

  selectSection = () => {
    const { section, onSectionSelected } = this.props;
    console.log('Select section', section.river.name, section.name );
    onSectionSelected(section);
  };

  deselectSection = () => {
    this.props.onSectionSelected(null);
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
        flat={false}
        onPress={this.selectSection}
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
    const { section, selected } = this.props;
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
          onPress={this.selectSection}
          coordinates={coordinates}
        />
        <MapView.Marker
          ref={(el) => { this.calloutMarker = el; }}
          onPress={this.selectSection}
          coordinate={{ longitude: (putInLng + takeOutLng) / 2, latitude: (putInLat + takeOutLat) / 2 }}
        >
          <View style={styles.calloutMarker} pointerEvents="none" />
        </MapView.Marker>
        { this.renderArrow() }
      </View>
    );
  }
}


export default SimpleSection;
