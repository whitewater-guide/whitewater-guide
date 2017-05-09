import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Svg, Polygon } from 'react-native-svg';
import MapView from 'react-native-maps';
import PurePolyline from './PurePolyline';
import { SectionPropType, getSectionColor } from '../../commons/features/sections';

const Anchor = { x: 0.5, y: 0.5 };

class SimpleSection extends React.PureComponent {
  static propTypes = {
    section: SectionPropType.isRequired,
    selected: PropTypes.bool,
    onSectionSelected: PropTypes.func.isRequired,
    zoom: PropTypes.number.isRequired,
    useSectionShapes: PropTypes.bool,
  };

  static defaultProps = {
    selected: false,
    useSectionShapes: false,
  };

  selectSection = () => {
    const { section, onSectionSelected } = this.props;
    onSectionSelected(section);
  };

  renderArrow = (color) => {
    const { section, zoom } = this.props;
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
            points="7,6 22,12 7,18"
            rotate={rotate}
            scale={scale}
            fill={color}
          />
        </Svg>
      </MapView.Marker>
    );
  };

  render() {
    const { section, selected, useSectionShapes } = this.props;
    const {
      putIn: { coordinates: [putInLng, putInLat] },
      takeOut: { coordinates: [takeOutLng, takeOutLat] },
      shape,
    } = section;
    const coordinates = (useSectionShapes && shape) ?
      shape.map(pt => ({ latitude: pt[1], longitude: pt[0] })) :
      [{ latitude: putInLat, longitude: putInLng }, { latitude: takeOutLat, longitude: takeOutLng }];
    const flows = section.flows || {};
    const levels = section.levels || {};
    const bindings = flows.lastValue ? flows : levels;
    const color = getSectionColor(bindings);
    return (
      <View>
        <PurePolyline
          strokeWidth={selected ? 5 : 3}
          strokeColor={color}
          onPress={this.selectSection}
          coordinates={coordinates}
        />
        { this.renderArrow(color) }
      </View>
    );
  }
}


export default SimpleSection;
