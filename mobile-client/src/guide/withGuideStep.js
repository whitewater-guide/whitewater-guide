import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { showGuideStep, completeGuideStep, hideGuideStep } from './actions';

// const defaultStateRoot = state => state.guidedTour;
const defaultStateRoot = state => state.persistent.guidedTour;

export const withGuideStep = (step, stateRoot) => compose(
  connect(
    (state, ownProps) => {
      const getRoot = stateRoot || ownProps.stateRoot || defaultStateRoot;
      const stepNum = (step === undefined ? ownProps.step : step) || 0;
      return getRoot(state)[stepNum];
    },
    (dispatch, ownProps) => {
      const stepNum = (step === undefined ? ownProps.step : step) || 0;
      return {
        show: () => dispatch(showGuideStep(stepNum)),
        complete: () => dispatch(completeGuideStep(stepNum)),
        hide: () => dispatch(hideGuideStep(stepNum)),
      };
    },
    (stateProps, dispatchProps, ownProps) => ({
      ...ownProps,
      guideStep: {
        ...stateProps,
        ...dispatchProps,
      },
    }),
  ),
  lifecycle({
    componentDidMount() {
      console.log('With Guide Step Mounted');
      this.props.guideStep.show();
    },
    componentWillUnmount() {
      console.log('With Guide Step unmounted');
      this.props.guideStep.hide();
    },
  }),
);
