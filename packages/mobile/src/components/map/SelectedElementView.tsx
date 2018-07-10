import React, { Component } from 'react';
import { Animated, InteractionManager, LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import Interactable from 'react-native-interactable';
import { cloneableGenerator } from 'redux-saga/utils';
import theme from '../../theme';
import { Coordinate, Point, Section } from '../../ww-commons';
import { NAVIGATE_BUTTON_HEIGHT, NAVIGATE_BUTTON_WIDTH, NavigateButton } from '../NavigateButton';

const styles = StyleSheet.create({
  panel: {
    width: theme.screenWidth,
    paddingBottom: 0,
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  header: {
    width: theme.screenWidth,
    height: NAVIGATE_BUTTON_HEIGHT,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
});

interface NavButtonProps {
  label: string;
  coordinates: Coordinate;
  canNavigate: (coordinates: Coordinate) => boolean;
}

interface Props {
  buttons: NavButtonProps[];
  renderHeader: () => React.ReactElement<{}>;
  renderBackground?: () => React.ReactElement<{}>;
  selected: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
  onSectionSelected: (section: Section | null) => void;
  onPOISelected: (point: Point | null) => void;
  onMaximize?: () => void;
  onMinimize?: () => void;
}

interface State {
  laidOut: boolean;
  height: number;
  panelHeight: number;
  snapPoints: any[];
  deltaY?: Animated.Value;
  slideAnimated?: Animated.Animated;
}

export default class SelectedElementView extends React.Component<Props, State> {
  _interactable: any = null;
  _muteSnapEvent: boolean = false;
  _snapIndex: number = 0;

  state: State = {
    laidOut: false,
    height: 0,
    panelHeight: NAVIGATE_BUTTON_HEIGHT + 10,
    snapPoints: [],
  };

  componentDidUpdate(prevProps: Props) {
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

  onLayout = (e: LayoutChangeEvent) => {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
    const { nativeEvent: { layout: { height } } } = e;
    if (!this.state.laidOut) {
      const deltaY = new Animated.Value(height);
      const slideAnimated = Animated.multiply(Animated.add(deltaY, -height), -1);
      this.setState((prevState) => ({
        deltaY,
        slideAnimated,
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

  onPanelLayout = ({ nativeEvent: { layout: { height: panelHeight } } }: LayoutChangeEvent) => {
    this.setState((prevState) => ({
      panelHeight,
      snapPoints: [
        { y: prevState.height },
        { y: prevState.height - NAVIGATE_BUTTON_HEIGHT },
        { y: prevState.height - panelHeight },
      ],
    }));
  };

  onSnap = ({ nativeEvent: { index } }: any) => {
    this._snapIndex = index;
    if (!this._muteSnapEvent && index === 0) {
      this.props.onSectionSelected(null);
      this.props.onPOISelected(null);
    }
    this._muteSnapEvent = false;
    if (this._snapIndex === 2 && this.props.onMaximize) {
      this.props.onMaximize();
    } else if (this._snapIndex === 0 && this.props.onMinimize) {
      this.props.onMinimize();
    }
  };

  onHeaderPressed = () => {
    this._interactable.snapTo({ index: 2 });
  };

  setInteractable = (interactable: any) => {
    this._interactable = interactable;
    if (interactable && this.props.selected) {
      this._interactable.snapTo({ index: 1 });
      this._muteSnapEvent = true;
    }
  };

  renderButton = ({ label, coordinates, canNavigate }: NavButtonProps, index: number) => {
    const numButtons = this.props.buttons.length;
    const step = 66 / numButtons;
    return (
      <NavigateButton
        key={`nav_button_${index}`}
        label={label}
        driver={this.state.slideAnimated}
        animationType="slide"
        inputRange={[34 + step * index, 34 + step * (index - 1)]}
        style={{ zIndex: numButtons - index }}
        position={index}
        coordinates={coordinates}
        canNavigate={canNavigate}
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
              styles.shade,
              {
                opacity: this.state.deltaY.interpolate({
                  inputRange: [this.state.snapPoints[2].y, this.state.snapPoints[1].y],
                  outputRange: [0.5, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            {this.props.renderBackground && this.props.renderBackground()}
          </Animated.View>
        }
        {
          this.state.laidOut &&
          <Interactable.View
            ref={this.setInteractable}
            verticalOnly
            animatedNativeDriver
            snapPoints={this.state.snapPoints}
            onSnap={this.onSnap}
            initialPosition={this.state.snapPoints[0]}
            animatedValueY={this.state.deltaY}
          >
            <View style={styles.panel} onLayout={this.onPanelLayout}>
              <TouchableOpacity onPress={this.onHeaderPressed}>
                <View style={styles.header}>
                  <View style={{ width: theme.screenWidth - this.props.buttons.length * NAVIGATE_BUTTON_WIDTH }}>
                    {this.props.renderHeader()}
                  </View>
                  {this.props.buttons.map(this.renderButton)}
                </View>
              </TouchableOpacity>
              {this.props.children}
            </View>
          </Interactable.View>
        }
      </View>
    );
  }
}
