import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
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

  constructor(props) {
    super(props);
    this._childWrapper = null;
    this.state = {
      measured: false,
      layout: null,
    };
  }

  componentDidMount() {
    const { background, guideStep } = this.props;
    const { portalSet } = this.context;
    if (portalSet && guideStep.active && this.state.layout) {
      portalSet('guidedTourPortal', cloneElement(background, { layout: this.state.layout }));
    }
  }

  componentWillReceiveProps(newProps) {
    const { background, guideStep } = this.props;
    const { portalSet } = this.context;
    if (!portalSet) {
      return;
    }
    if (newProps.guideStep.active) {
      if (!guideStep.active || background !== newProps.background && this.state.layout) {
        portalSet('guidedTourPortal', cloneElement(newProps.background, { layout: this.state.layout }));
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

  onLayout = debounce(() => {
    if (this._childWrapper) {
      const handle = findNodeHandle(this._childWrapper);
      if (handle) {
        NativeModules.UIManager.measure(handle, this.onChildMeasured);
      }
    }
  }, 50);

  onChildMeasured = (_x, _y, width, height, x, y) => {
    this.setState({ measured: true, layout: { x, y, width, height } });
    const { background, guideStep } = this.props;
    const { portalSet } = this.context;
    if (portalSet && guideStep.active) {
      portalSet('guidedTourPortal', cloneElement(background, { layout: this.state.layout }));
    }
  };

  setChildWrapperRef = (ref) => {
    this._childWrapper = ref;
    this.onLayout();
  };

  render() {
    return cloneElement(
      Children.only(this.props.children),
      {
        onLayout: this.onLayout,
        ref: this.setChildWrapperRef,
      },
    );
  }

}

export default withGuideStep()(GuideStepOverlay);
