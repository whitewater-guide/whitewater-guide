import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { InteractionManager, NativeModules, StyleSheet, View, findNodeHandle } from 'react-native';
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
    shouldBeDisplayed: PropTypes.bool,
    showGuideStep: PropTypes.func.isRequired,
    completeGuideStep: PropTypes.func.isRequired,
    renderBackground: PropTypes.func,
    trigger: PropTypes.string,
  };

  static defaultProps = {
    trigger: 'onPress',
    renderBackground: null,
    shouldBeDisplayed: true,
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
    };
    this._childWrapper = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.shouldBeDisplayed && nextProps.shouldBeDisplayed) {
      this.showStep();
    }
    if (!this.props.active && nextProps.active && this._childWrapper) {
      const handle = findNodeHandle(this._childWrapper);
      if (handle) {
        NativeModules.UIManager.measure(handle, this.onChildMeasured);
      }
    }
  }

  onChildMeasured = (_x, _y, width, height, x, y) => {
    // console.log('Child measured', width, height, x, y);
    this.setState({ measured: true, layout: { x, y, width, height } });
  };

  onLayout = () => {
    if (!this.props.active && this.props.shouldBeDisplayed) {
      this.showStep();
    }
  };

  setChildWrapperRef = (ref) => {
    this._childWrapper = ref;
    // Sometimes onLayout is not provided. It's okay, we just need to know when child was mounted
    // On layout is needed for components that resize on mount
    this.onLayout();
  };

  showStep = debounce(() => {
    InteractionManager.runAfterInteractions(() => this.props.showGuideStep(this.props.step));
  }, 100);

  completeStep = () => this.props.completeGuideStep(this.props.step);

  render() {
    const { active, children, trigger, renderBackground, shouldBeDisplayed } = this.props;
    const { measured, layout } = this.state;
    if (shouldBeDisplayed && active && measured) {
      return (
        <BlackPortal name="guidePortal">
          <View removeClippedSubviews style={styles.portal} pointerEvents="box-none" >
            { renderBackground(layout, this.completeStep) }
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
    return cloneElement(
      Children.only(children),
      {
        onLayout: this.onLayout,
        ref: this.setChildWrapperRef,
      },
    );
  }
}

export default connect(
  (state, { step }) => ({ active: state.persistent.guide.currentStep === step }),
  { completeGuideStep, showGuideStep },
)(GuideStep);
