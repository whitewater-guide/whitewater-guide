import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, Dimensions, Animated } from 'react-native';
import Interactable from 'react-native-interactable';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - (Platform.OS === 'ios' ? 114 : 106),
};

const styles = StyleSheet.create({
  panel: {
    height: 200,
    width: Screen.width,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffffe8',
    borderWidth: 0,
  },
});

export default class MapLayout extends Component {
  static propTypes = {
    selectedSection: PropTypes.object,
    selectedPOI: PropTypes.object,
    onSectionSelected: PropTypes.func.isRequired,
    onPOISelected: PropTypes.func.isRequired,
    mapView: PropTypes.element.isRequired,
    selectedSectionView: PropTypes.element.isRequired,
    selectedPOIView: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height);
  }

  componentDidUpdate(prevProps) {
    if (this.hasSelection(this.props) && !this.hasSelection(prevProps)) {
      this.interactable.snapTo({ index: 1 });
    } else if (!this.hasSelection(this.props) && this.hasSelection(prevProps)) {
      this.interactable.snapTo({ index: 0 });
    }
  }

  onSnap = ({ nativeEvent: { index } }) => {
    if (index === 0) {
      this.props.onSectionSelected(null);
      this.props.onPOISelected(null);
    }
  };

  hasSelection = props => props.selectedSection || props.selectedPOI;

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>

        { this.props.mapView }

        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'black',
                opacity: this._deltaY.interpolate({
                  inputRange: [Screen.height - 200, Screen.height],
                  outputRange: [0.5, 0.0],
                  extrapolateRight: 'clamp',
                }),
              },
            ]}
          />
          <Interactable.View
            ref={(interactable) => { this.interactable = interactable; }}
            verticalOnly
            snapPoints={[{ y: Screen.height }, { y: Screen.height - 80 }, { y: Screen.height - 200 }]}
            onSnap={this.onSnap}
            initialPosition={{ y: Screen.height }}
            animatedValueY={this._deltaY}
          >
            <View style={styles.panel}>
              { this.props.selectedSectionView }
              { this.props.selectedPOIView }
            </View>
          </Interactable.View>
        </View>

      </View>
    );
  }
}
