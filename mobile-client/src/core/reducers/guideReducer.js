import { set } from 'lodash/fp';
import { GUIDE_STEP_COMPLETE, GUIDE_STEP_SHOW, GUIDE_STEP_HIDE } from '../actions';

const initialState = {
  currentStep: -1,
  steps: [],
};

const getCurrentStep = steps => steps.findIndex(step => step.visible && !step.completed);

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case GUIDE_STEP_SHOW: {
      const steps = set(`${payload.stepId}.visible`, true, state.steps);
      return { currentStep: getCurrentStep(steps), steps };
    }
    case GUIDE_STEP_HIDE: {
      const steps = set(`${payload.stepId}.visible`, false, state.steps);
      return { currentStep: getCurrentStep(steps), steps };
    }
    case GUIDE_STEP_COMPLETE: {
      const steps = set(`${payload.stepId}.completed`, true, state.steps);
      return { currentStep: getCurrentStep(steps), steps };
    }
    default:
      return state;
  }
};
