import { BoomPromoInfo, Region } from '@whitewater-guide/commons';
import { useCallback, useReducer } from 'react';
import { Steps } from './Steps';

export interface CompletedSteps {
  [index: number]: boolean;
}

export interface StepperState {
  readonly activeStep: number;
  readonly completedSteps: CompletedSteps;
  readonly promo: BoomPromoInfo | null;
  readonly region: Region | null;
}

export interface StepperActions {
  nextStep: (payload?: any) => void;
  prevStep: () => void;
}

const defaultState: StepperState = {
  activeStep: Steps.LOGIN,
  completedSteps: {},
  promo: null,
  region: null,
};

interface Action {
  type: 'next' | 'prev';
  payload?: any;
}

const completeStep = (state: StepperState, index: number, value: boolean) => ({
  ...state,
  completedSteps: { ...state.completedSteps, [index]: value },
});

const onPromoReceived = (
  state: StepperState,
  payload: BoomPromoInfo,
): StepperState => {
  let result: StepperState = { ...state, promo: payload };
  if (payload && payload.groupName) {
    result = completeStep(result, Steps.SELECT_REGION, false);
    return { ...result, activeStep: Steps.CONFIRM };
  }
  return { ...result, activeStep: Steps.SELECT_REGION };
};

const onRegionSelected = (
  state: StepperState,
  region: Region,
): StepperState => {
  if (!region.sku) {
    throw new Error('Region must have sku');
  }
  return { ...state, activeStep: Steps.CONFIRM, region };
};

const reducer = (state: StepperState, { type, payload }: Action) => {
  if (type === 'next') {
    const result = completeStep(state, state.activeStep, true);
    switch (result.activeStep) {
      case Steps.LOGIN:
        return {
          ...result,
          activeStep: result.activeStep + 1,
        };
      case Steps.ENTER_CODE:
        return onPromoReceived(result, payload);
      case Steps.SELECT_REGION:
        return onRegionSelected(result, payload);
      case Steps.CONFIRM:
        return state;
      default:
        return { ...result, activeStep: result.activeStep + 1 };
    }
  } else {
    let shift = 1;
    let result = { ...state };
    switch (state.activeStep) {
      case Steps.SELECT_REGION:
        result.promo = null;
        break;
      case Steps.CONFIRM:
        result.region = null;
        result = completeStep(result, result.activeStep - 1, false);
        if (result.promo && result.promo.groupSku) {
          result.promo = null;
          shift = 2;
        }
        break;
    }
    result = completeStep(result, result.activeStep - shift, false);
    return { ...result, activeStep: result.activeStep - shift };
  }
};

export const useStepper = (
  initialState: StepperState = defaultState,
): StepperState & StepperActions => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const nextStep = useCallback(
    (payload?: any) => dispatch({ type: 'next', payload }),
    [dispatch],
  );
  const prevStep = useCallback(() => dispatch({ type: 'prev' }), [dispatch]);

  return {
    ...state,
    nextStep,
    prevStep,
  };
};
