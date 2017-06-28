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
    selected: PropTypes.bool.isRequired,
    onLayout: PropTypes.func,
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
      height: 0,
      panelHeight: NAVIGATE_BUTTON_HEIGHT + 10,
      snapPoints: [],
    };
    this._deltaY = null;
    this._slideAnimated = null;
    this._interactable = null;
    this._muteSnapEvent = false;
    this._snapIndex = 0;
  }

  componentDidUpdate(prevProps) {
    if (!this._interactable) {
      return;
    }
    if (this.props.selected) {
      // If it is open wide, keep it open wide
      this._interactable.snapTo({ index: Math.max(1, this._snapIndex) });
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

  onLayout = (e) => {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
    const { nativeEvent: { layout: { height } } } = e;
    if (!this.state.laidOut) {
      this._deltaY = new Animated.Value(height);
      this._slideAnimated = Animated.multiply(Animated.add(this._deltaY, -height), -1);
      this.setState(prevState => ({
        laidOut: true,
        height,
        snapPoints: [
          { y: height },
          { y: height - NAVIGATE_BUTTON_HEIGHT },
          { y: height - prevState.panelHeight },
        ],
      }));
    }
  };

  onPanelLayout = ({ nativeEvent: { layout: { height: panelHeight } } }) => {
    this.setState(prevState => ({
      panelHeight,
      snapPoints: [
        { y: prevState.height },
        { y: prevState.height - NAVIGATE_BUTTON_HEIGHT },
        { y: prevState.height - panelHeight },
      ],
    }));
  };

  onSnap = ({ nativeEvent: { index } }) => {
    this._snapIndex = index;
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
                  inputRange: [this.state.snapPoints[2].y, this.state.snapPoints[1].y],
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
            snapPoints={this.state.snapPoints}
            onSnap={this.onSnap}
            initialPosition={this.state.snapPoints[0]}
            animatedValueY={this._deltaY}
          >
            <View style={styles.panel} onLayout={this.onPanelLayout}>
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
