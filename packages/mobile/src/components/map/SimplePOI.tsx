import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Circle, Svg } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { POIComponentProps } from '../../ww-clients/features/maps';

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

const IconKinds = {
  'put-in': 'arrow-downward',
  'take-out': 'arrow-upward',
  'put-in-alt': 'arrow-downward',
  'put-in-road': 'local-parking',
  'take-out-alt': 'arrow-upward',
  'take-out-road': 'local-parking',
  waterfall: 'adjust', // TODO: google maps online have icon for waterfall
  rapid: 'adjust',
  portage: 'directions-walk',
  playspot: 'stars',
  hazard: 'warning',
  'river-campsite': 'adjust',
  'wild-camping': 'adjust',
  'paid-camping': 'adjust',
  gauge: 'straighten',
  'hike-waypoint': 'adjust',
  bridge: 'adjust',
  other: 'adjust',
};

const Anchor = { x: 0.5, y: 0.5 };

const renderCustomMarkerView = (kind: string) => {
  const icon = IconKinds[kind] || 'adjust';
  return (
    <View style={styles.iconContainer}>
      <Icon name={icon} color="white" />
    </View>
  );
};

const renderCircle = (zoom: number, selected?: boolean) => {
  const radius = zoom / 2;
  return (
    <Svg width={radius * 2} height={radius * 2}>
      <Circle
        cx={radius}
        cy={radius}
        r={radius}
        fill={selected ? 'red' : 'black'}
      />
    </Svg>
  );
};

export class SimplePOI extends React.PureComponent<POIComponentProps> {
  onPress = () => this.props.onPOISelected(this.props.poi);

  render() {
    const { poi, zoom } = this.props;
    if (zoom < 3) {
      return null;
    }
    const { coordinates: [longitude, latitude], kind } = poi;
    const inner = zoom < 12 ? renderCircle(zoom) : renderCustomMarkerView(kind);
    return (
      <Marker
        anchor={Anchor}
        onPress={this.onPress}
        coordinate={{ longitude, latitude }}
      >
        { inner }
      </Marker>
    );
  }
}
