import { actionCreatorFactory } from 'typescript-fsa';

const factory = actionCreatorFactory('APP');

export const appStarted = factory('APP_STARTED');
export const bootstrapped = factory('BOOTSTRAPPED');
export const toggleDrawer = factory<boolean | null>('TOGGLE_DRAWER');

export * from './resetNavigationToLogin';
export * from './resetNavigationToHome';
