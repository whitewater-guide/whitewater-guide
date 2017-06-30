import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { NativeModules, findNodeHandle } from 'react-native';
import { withGuideStep } from './withGuideStep';
import { GuideStepPropType } from './PropTypes';

class GuideStepOverlay extends React.PureComponent {
  static contextTypes = {
    portalSub: PropTypes.func,
    portalUnsub: PropTypes.func,
    portalSet: PropTypes.func,
    portalGet: PropTypes.func,
  };

  static propTypes = {
    guideStep: GuideStepPropType.isRequired,
    background: PropTypes.element.isRequired,
  };

  // constructor(props) {
  //   super(props);
  //   this._childWrapper = null;
  // }

  componentDidMount() {
    const { background, guideStep } = this.props;
    const { portalSet } = this.context;
    if (portalSet && guideStep.active) {
      portalSet('guidedTourPortal', background);
    }
  }

  componentWillReceiveProps(newProps) {
    const { background, guideStep } = this.props;
    const { portalSet } = this.context;
    if (!portalSet) {
      return;
    }
    if (newProps.guideStep.active) {
      if (!guideStep.active || background !== newProps.background) {
        portalSet('guidedTourPortal', newProps.background);
      }
    } else {
      portalSet('guidedTourPortal', null);
    }
  }

  componentWillUnmount() {
    const { portalSet } = this.context;
    if (portalSet) {
      portalSet('guidedTourPortal', null);
    }
  }
  //
  // onLayout = () => {
  //   if (this._childWrapper) {
  //     const handle = findNodeHandle(this._childWrapper);
  //     if (handle) {
  //       NativeModules.UIManager.measure(handle, this.onChildMeasured);
  //     }
  //   }
  // };
  //
  // onChildMeasured = (_x, _y, width, height, x, y) => {
  //   // console.log('Child measured', width, height, x, y);
  //   this.setState({ measured: true, layout: { x, y, width, height } });
  // };
  //
  // setChildWrapperRef = (ref) => {
  //   this._childWrapper = ref;
  //   this.onLayout();
  // };

  render() {
    return this.props.children;
    // return cloneElement(
    //   Children.only(this.props.children),
    //   {
    //     onLayout: this.onLayout,
    //     ref: this.setChildWrapperRef,
    //   },
    // );
  }

}

export default withGuideStep()(GuideStepOverlay);
