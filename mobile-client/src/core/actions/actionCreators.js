import { createAction } from 'redux-actions';
import * as ActionTypes from './ActionTypes';

export const toggleDrawer = createAction(ActionTypes.TOGGLE_DRAWER, isOpen => ({ isOpen }));
export const toggleMapType = createAction(ActionTypes.TOGGLE_MAP_TYPE, mapType => ({ mapType }));

export const completeGuideStep = createAction(ActionTypes.GUIDE_STEP_COMPLETE, stepId => ({ stepId }));
export const showGuideStep = createAction(ActionTypes.GUIDE_STEP_SHOW, stepId => ({ stepId }));
export const hideGuideStep = createAction(ActionTypes.GUIDE_STEP_HIDE, stepId => ({ stepId }));
