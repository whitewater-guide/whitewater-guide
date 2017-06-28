import { connect } from 'react-redux';
import { showGuideStep, completeGuideStep, hideGuideStep } from '../../core/actions';

export const withGuidedStep = step => connect(
  state => ({
    ...state.persistent.guide.steps[step],
    active: state.persistent.guide.currentStep === step,
  }),
  {
    show: () => showGuideStep(step),
    complete: () => completeGuideStep(step),
    hide: () => hideGuideStep(step),
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    guideStep: {
      order: step,
      ...stateProps,
      ...dispatchProps,
    },
  }),
);
