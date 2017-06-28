import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Animated, InteractionManager, NativeModules, StyleSheet, View, findNodeHandle } from 'react-native';
import { connect } from 'react-redux';
import { BlackPortal } from 'react-native-portal';
import { completeGuideStep, showGuideStep } from '../../core/actions';

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  portal: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
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
    this._childWrapper = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active && this._childWrapper) {
      const handle = findNodeHandle(this._childWrapper);
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
      this.onMeasuredStateSet,
    );
  };

  onMeasuredStateSet = () => {
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this.state.animated, { duration: 200, toValue: 1, useNativeDriver: true }).start();
    });
  };

  onLayout = () => {
    if (!this.props.active) {
      this.showStep();
    }
  };

  setChildWrapperRef = (ref) => { this._childWrapper = ref; };

  showStep = debounce(() => {
    InteractionManager.runAfterInteractions(() => this.props.showGuideStep(this.props.step));
  }, 100);

  completeStep = () => this.props.completeGuideStep(this.props.step);

  renderDefaultBackground = (animated, layout, completeGuideStep) => {
    const dynamicStyle = {
      opacity: animated.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5], extrapolate: 'clamp' }),
    };
    return (
      <Animated.View style={[styles.background, dynamicStyle]} />
    );
  };

  render() {
    const { active, children, trigger, renderBackground, completeGuideStep } = this.props;
    const { animated, measured, layout } = this.state;
    const renderer = renderBackground || this.renderDefaultBackground;
    const background = renderer(animated, layout, completeGuideStep);
    if (active && measured) {
      return (
        <BlackPortal name="guidePortal">
          <View removeClippedSubviews style={styles.portal} pointerEvents="box-none" >
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
      <View onLayout={this.onLayout} ref={this.setChildWrapperRef} pointerEvents="box-none">
        { Children.only(children) }
      </View>
    );
  }
}

export default connect(
  (state, { step }) => ({ active: state.persistent.guide.currentStep === step }),
  { completeGuideStep, showGuideStep },
)(GuideStep);
