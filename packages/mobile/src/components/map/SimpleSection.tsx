import bearing from '@turf/bearing';
import { bearingToAzimuth } from '@turf/helpers';
import {
  computeDistanceBetween,
  getSectionColorRaw,
  SectionComponentProps,
} from '@whitewater-guide/clients';
import React from 'react';
import { Circle, Marker } from 'react-native-maps';
import Svg, { Polygon } from 'react-native-svg';
import PurePolyline from './PurePolyline';

const Anchor = { x: 0.5, y: 0.5 };

interface OwnProps {
  renderArrowhead?: boolean;
}

type Props = SectionComponentProps & OwnProps;

export class SimpleSection extends React.PureComponent<Props> {
  _radius: number;
  _center: { latitude: number; longitude: number };

  constructor(props: SectionComponentProps) {
    super(props);
    const {
      putIn: { coordinates: putIn },
      takeOut: { coordinates: takeOut },
    } = props.section;
    this._radius = computeDistanceBetween(putIn, takeOut) * 500;
    this._center = {
      latitude: (putIn[1] + takeOut[1]) / 2,
      longitude: (putIn[0] + takeOut[0]) / 2,
    };
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
      putIn: {
        coordinates: [putInLng, putInLat],
      },
      takeOut: {
        coordinates: [takeOutLng, takeOutLat],
      },
    } = section;
    if (zoom < 3) {
      return null;
    }
    const rotate =
      bearingToAzimuth(
        bearing([putInLng, putInLat], [takeOutLng, takeOutLat]),
      ) - 90;

    const scale = Math.min(1, (zoom - 3) / 8);
    // TODO: tracksViewChanges makes markers stick to specific zoom, but is necessary for performance on Android
    //        tracksInfoWindowChanges={false}
    //         tracksViewChanges={Platform.OS === 'ios'}
    return (
      <Marker
        anchor={Anchor}
        flat={false}
        onPress={this.selectSection}
        coordinate={{ longitude: takeOutLng, latitude: takeOutLat }}
        rotation={rotate}
      >
        <Svg width={24} height={24}>
          <Polygon
            originX="12"
            originY="12"
            points="7,6 22,12 7,18"
            scale={scale}
            fill={color}
            stroke={color}
          />
        </Svg>
      </Marker>
    );
  };

  render() {
    const { section, selected, useSectionShapes, renderArrowhead } = this.props;
    const {
      putIn: {
        coordinates: [putInLng, putInLat],
      },
      takeOut: {
        coordinates: [takeOutLng, takeOutLat],
      },
      shape,
    } = section;
    const coordinates =
      useSectionShapes && shape
        ? shape.map((pt) => ({ latitude: pt[1], longitude: pt[0] }))
        : [
            { latitude: putInLat, longitude: putInLng },
            { latitude: takeOutLat, longitude: takeOutLng },
          ];
    const color = getSectionColorRaw(section);
    const fill = color // hsl
      .string()
      .replace('hsl', 'hsla')
      .replace(')', ',0.3)');
    const rgbColor = color.rgb().string();
    // if (bindings.approximate) {
    //   color = color.replace('hsl', 'hsla').replace(')', ',0.66)');
    // }
    return (
      <React.Fragment>
        {selected && (
          <Circle
            center={this._center}
            radius={this._radius}
            fillColor={fill}
            strokeWidth={0}
          />
        )}
        <PurePolyline
          tappable
          strokeWidth={selected ? 5 : 3}
          strokeColor={rgbColor}
          onPress={this.selectSection}
          coordinates={coordinates}
        />
        {renderArrowhead && this.renderArrow(rgbColor)}
      </React.Fragment>
    );
  }
}
