import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import Interactable from 'react-native-interactable';
import { NavigateButton, NAVIGATE_BUTTON_HEIGHT, NAVIGATE_BUTTON_WIDTH } from '../../components';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  panel: {
    width: window.width,
    paddingBottom: 0,
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  header: {
    width: window.width,
    height: NAVIGATE_BUTTON_HEIGHT,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
});

export default class SelectedElementView extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number),
    })),
    header: PropTypes.element,
    panelHeight: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    onSectionSelected: PropTypes.func,
    onPOISelected: PropTypes.func,
  };

  static defaultProps = {
    buttons: [],
    header: null,
    onSectionSelected: () => {},
    onPOISelected: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      laidOut: false,
    };
    this._deltaY = null;
    this._slideAnimated = null;
    this._height = 0;
    this._snapPoints = [];
    this._interactable = null;
    this._muteSnapEvent = false;
  }

  componentDidUpdate(prevProps) {
    if (!this._interactable) {
      return;
    }
    if (this.props.selected && !prevProps.selected) {
      this._interactable.snapTo({ index: 1 });
      this._muteSnapEvent = true;
    } else if (!this.props.selected && prevProps.selected) {
      this._interactable.snapTo({ index: 0 });
      this._muteSnapEvent = true;
    }
  }

  componentWillUnmount() {
    if (this._interactable) {
      this._interactable.snapTo({ index: 0 });
    }
  }

  onLayout = ({ nativeEvent: { layout: { height } } }) => {
    if (!this.state.laidOut) {
      this._height = height;
      this._snapPoints = [
        { y: this._height },
        { y: this._height - NAVIGATE_BUTTON_HEIGHT },
        { y: this._height - this.props.panelHeight },
      ];
      this._deltaY = new Animated.Value(this._height);
      this._slideAnimated = Animated.multiply(Animated.add(this._deltaY, -this._height), -1);
      this.setState({ laidOut: true });
    }
  };

  onSnap = ({ nativeEvent: { index } }) => {
    if (!this._muteSnapEvent && index === 0) {
      this.props.onSectionSelected(null);
      this.props.onPOISelected(null);
    }
    this._muteSnapEvent = false;
  };

  onHeaderPressed = () => {
    this._interactable.snapTo({ index: 2 });
  };

  setInteractable = (interactable) => {
    this._interactable = interactable;
    if (interactable && this.props.selected) {
      this._interactable.snapTo({ index: 1 });
      this._muteSnapEvent = true;
    }
  };

  renderButton = ({ label, coordinates }, index) => {
    const numButtons = this.props.buttons.length;
    const step = 66 / numButtons;
    return (
      <NavigateButton
        key={`nav_button_${index}`}
        label={label}
        driver={this._slideAnimated}
        animationType="slide"
        inputRange={[34 + step * index, 34 + step * (index - 1)]}
        style={{ zIndex: numButtons - index }}
        position={index}
        coordinates={coordinates}
      />
    );
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill} onLayout={this.onLayout} pointerEvents="box-none">
        {
          this.state.laidOut &&
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'black',
                opacity: this._deltaY.interpolate({
                  inputRange: [this._snapPoints[2].y, this._snapPoints[1].y],
                  outputRange: [0.5, 0.0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        }
        {
          this.state.laidOut &&
          <Interactable.View
            ref={this.setInteractable}
            verticalOnly
            snapPoints={this._snapPoints}
            onSnap={this.onSnap}
            initialPosition={this._snapPoints[0]}
            animatedValueY={this._deltaY}
          >
            <View style={[styles.panel, { height: this.props.panelHeight }]}>
              <TouchableOpacity onPress={this.onHeaderPressed}>
                <View style={styles.header}>
                  <View style={{ width: window.width - this.props.buttons.length * NAVIGATE_BUTTON_WIDTH }}>
                    { this.props.header }
                  </View>
                  { this.props.buttons.map(this.renderButton) }
                </View>
              </TouchableOpacity>
              { this.props.children }
            </View>
          </Interactable.View>
        }
      </View>
    );
  }
}
