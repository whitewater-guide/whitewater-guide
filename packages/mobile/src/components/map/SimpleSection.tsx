import React from 'react';
import { Circle, Marker } from 'react-native-maps';
import { Polygon, Svg } from 'react-native-svg';
import { SectionComponentProps } from '../../ww-clients/features/maps';
import { getSectionColor } from '../../ww-clients/features/sections';
import { computeDistanceBetween } from '../../ww-clients/utils';
import PurePolyline from './PurePolyline';

const Anchor = { x: 0.5, y: 0.5 };

export class SimpleSection extends React.PureComponent<SectionComponentProps> {
  _radius: number;
  _center: { latitude: number, longitude: number };

  constructor(props: SectionComponentProps) {
    super(props);
    const {
      putIn: { coordinates: putIn },
      takeOut: { coordinates: takeOut },
    } = props.section;
    this._radius = computeDistanceBetween(putIn, takeOut) * 500;
    this._center = { latitude: (putIn[1] + takeOut[1]) / 2, longitude: (putIn[0] + takeOut[0]) / 2 };
  }

  selectSection = (e: any) => {
    // This will stop the parent `MapView`'s `onPress` from being called. **Note**: iOS only.
    // Android does not propagate `onPress` events.
    e.stopPropagation();
    const { section, onSectionSelected } = this.props;
    if (onSectionSelected) {
      onSectionSelected(section);
    }
  };

  renderArrow = (color: string) => {
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
    // TODO: tracksViewChanges makes markers stick to specific zoom, but is necessary for performance on Android
    return (
      <Marker
        anchor={Anchor}
        flat={false}
        onPress={this.selectSection}
        coordinate={{ longitude: takeOutLng, latitude: takeOutLat }}
        tracksInfoWindowChanges={false}
        tracksViewChanges={false}
      >
        <Svg width={24} height={24}>
          <Polygon
            originX="12"
            originY="12"
            points="7,6 22,12 7,18"
            rotation={rotate}
            scale={scale}
            fill={color}
          />
        </Svg>
      </Marker>
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
      shape.map((pt) => ({ latitude: pt[1], longitude: pt[0] })) :
      [{ latitude: putInLat, longitude: putInLng }, { latitude: takeOutLat, longitude: takeOutLng }];
    const color = getSectionColor(section);
    const fill = color.replace('hsl', 'hsla').replace(')', ',0.3)');
    // if (bindings.approximate) {
    //   color = color.replace('hsl', 'hsla').replace(')', ',0.66)');
    // }
    return (
      <React.Fragment>
        {
          selected &&
          <Circle center={this._center} radius={this._radius} fillColor={fill} strokeWidth={0} />
        }
        <PurePolyline
          tappable
          strokeWidth={selected ? 5 : 3}
          strokeColor={color}
          onPress={this.selectSection}
          coordinates={coordinates}
        />
        {this.renderArrow(color)}
      </React.Fragment>
    );
  }
}
