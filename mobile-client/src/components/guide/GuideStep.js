import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Animated, NativeModules, StyleSheet, View, findNodeHandle } from 'react-native';
import { connect } from 'react-redux';
import { BlackPortal } from 'react-native-portal';
import { completeGuideStep, showGuideStep } from '../../core/actions';

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});

class GuideStep extends React.PureComponent {
  static propTypes = {
    step: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
    showGuideStep: PropTypes.func.isRequired,
    completeGuideStep: PropTypes.func.isRequired,
    renderBackground: PropTypes.func,
    trigger: PropTypes.string,
  };

  static defaultProps = {
    trigger: 'onPress',
    renderBackground: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      measured: false,
      layout: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      animated: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      const handle = findNodeHandle(this);
      if (handle) {
        NativeModules.UIManager.measure(handle, this.onChildMeasured);
      }
    }
  }

  onChildMeasured = (_x, _y, width, height, x, y) => {
    // console.log('Child measured', width, height, x, y);
    this.state.animated.setValue(0);
    this.setState(
      () => ({ measured: true, layout: { x, y, width, height } }),
      () => Animated.timing(this.state.animated, { duration: 200, toValue: 1, useNativeDriver: true }).start(),
    );
  };

  onLayout = () => {
    setTimeout(() => this.props.showGuideStep(this.props.step), 100);
  };

  completeStep = () => this.props.completeGuideStep(this.props.step);

  renderDefaultBackground = (animated, layout) => {
    const dynamicStyle = {
      opacity: animated.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5], extrapolate: 'clamp' }),
    };
    return (
      <Animated.View style={[styles.background, dynamicStyle]} />
    );
  };

  render() {
    const { active, children, trigger, renderBackground } = this.props;
    const { animated, measured, layout } = this.state;
    const renderer = renderBackground || this.renderDefaultBackground;
    const background = renderer(animated, layout);
    if (active && measured) {
      return (
        <BlackPortal name="guidePortal">
          <View style={StyleSheet.absoluteFill}>
            { background }
            {
              Children.map(children, child => cloneElement(
                child,
                {
                  [trigger]: () => { this.completeStep(); child.props[trigger](); },
                  style: [child.props.style, { position: 'absolute', left: layout.x, top: layout.y }],
                },
              ))
            }
          </View>
        </BlackPortal>
      );
    }
    return (
      <View onLayout={this.onLayout}>
        { Children.only(children) }
      </View>
    );
  }
}

export default connect(
  (state, { step }) => ({ active: state.persistent.guide.currentStep === step }),
  { completeGuideStep, showGuideStep },
)(GuideStep);
