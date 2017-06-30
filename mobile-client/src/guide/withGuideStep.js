import { connect } from 'react-redux';
import { showGuideStep, completeGuideStep, hideGuideStep } from './actions';

const defaultStateRoot = state => state.guidedTour;

export const withGuideStep = (step, stateRoot) => connect(
  (state, ownProps) => {
    const getRoot = stateRoot || ownProps.stateRoot || defaultStateRoot;
    const stepNum = (step === undefined ? ownProps.step : step) || 0;
    return getRoot(state)[stepNum];
  },
  {
    show: () => showGuideStep(step),
    complete: () => completeGuideStep(step),
    hide: () => hideGuideStep(step),
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    guideStep: {
      ...stateProps,
      ...dispatchProps,
    },
  }),
);
