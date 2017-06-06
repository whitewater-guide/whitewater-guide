import { createAction } from 'redux-actions';
import * as ActionTypes from './ActionTypes';

export const toggleDrawer = createAction(ActionTypes.TOGGLE_DRAWER, isOpen => ({ isOpen }));
