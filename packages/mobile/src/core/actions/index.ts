import { ActionCreator, actionCreatorFactory } from 'typescript-fsa';

const factory = actionCreatorFactory('APP');

export const appStarted = factory('APP_STARTED');
export const bootstrapped = factory('BOOTSTRAPPED');
export const toggleDrawer: ActionCreator<any> = factory('TOGGLE_DRAWER'); // boolean | null

export * from './resetNavigationToLogin';
export * from './resetNavigationToHome';
