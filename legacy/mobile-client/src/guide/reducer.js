import { set } from 'lodash/fp';
import times from 'lodash/times';
import { GUIDE_STEP_COMPLETE, GUIDE_STEP_SHOW, GUIDE_STEP_HIDE } from './actions';

function findActiveIndex(steps) {
  return steps.findIndex((step) => {
    const reqMet = !step.requires || step.requires.every(reqIndex => steps[reqIndex].completed);
    return reqMet && step.visible && !step.completed;
  });
}

function updateActiveState(steps) {
  const activeIndex = findActiveIndex(steps);
  return steps.map(step => ({ ...step, active: step.index === activeIndex }));
}

function setFlag(steps, index, flag, value) {
  return set(`${index}.${flag}`, value, steps);
}

export function guideReducer(config) {
  const initialSteps = times(
    config.numberOfSteps,
    index => ({ index, visible: false, completed: false, active: false }),
  );

  if (config.steps) {
    config.steps.forEach(({ index, ...step }) => {
      if (index >= initialSteps.length) {
        throw new Error(`Config says the numberOfSteps is ${initialSteps.length}, but step ${index} is defined`);
      }
      initialSteps[index] = { ...initialSteps[index], ...step };
    });
  }

  return (state = initialSteps, { type, payload }) => {
    let newState = state;
    switch (type) {
      case GUIDE_STEP_SHOW:
        newState = setFlag(state, payload.step, 'visible', true);
        break;
      case GUIDE_STEP_HIDE:
        newState = setFlag(state, payload.step, 'visible', false);
        break;
      case GUIDE_STEP_COMPLETE:
        newState = setFlag(state, payload.step, 'completed', true);
        break;
      default:
        return state;
    }
    return updateActiveState(newState);
  };
}
