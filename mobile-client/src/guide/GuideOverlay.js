import React from 'react';
import PropTypes from 'prop-types';
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

  render() {
    return this.props.children;
  }

}

export default withGuideStep()(GuideStepOverlay);
