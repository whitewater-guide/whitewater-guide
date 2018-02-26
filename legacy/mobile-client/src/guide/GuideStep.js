import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { InteractionManager, Modal, NativeModules, StyleSheet, View, findNodeHandle } from 'react-native';
import { withGuideStep } from './withGuideStep';
import { GuideStepPropType } from './PropTypes';

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
    stateRoot: PropTypes.func,
    guideStep: GuideStepPropType.isRequired,
    shouldBeDisplayed: PropTypes.bool,
    renderBackground: PropTypes.func,
    trigger: PropTypes.string,
  };

  static defaultProps = {
    trigger: 'completeStep',
    renderBackground: null,
    shouldBeDisplayed: true,
    stateRoot: undefined,
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
    if (!this.props.guideStep.active && nextProps.guideStep.active && this._childWrapper) {
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
    if (!this.props.guideStep.active && this.props.shouldBeDisplayed) {
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
    InteractionManager.runAfterInteractions(() => this.props.guideStep.show());
  }, 100);


  injectIntoChild = () => {
    const { children, trigger } = this.props;
    const layout = this.state.layout;
    const child = Children.only(children);
    return cloneElement(child, {
      [trigger]: () => {
        const ownProp = child.props[trigger];
        this.props.guideStep.complete();
        if (ownProp) {
          ownProp();
        }
      },
      style: [child.props.style, { position: 'absolute', left: layout.x, top: layout.y }],
    });
  };

  render() {
    const { children, guideStep, renderBackground, shouldBeDisplayed } = this.props;
    const { measured, layout } = this.state;
    if (shouldBeDisplayed && guideStep.active && measured) {
      return (
        <Modal visible transparent hardwareAccelerated onRequestClose={guideStep.complete} >
          <View removeClippedSubviews style={styles.portal} pointerEvents="box-none" >
            { renderBackground(layout, guideStep.complete) }
            { this.injectIntoChild() }
          </View>
        </Modal>
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

export default withGuideStep()(GuideStep);
