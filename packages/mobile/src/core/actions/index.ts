import { ActionCreator, actionCreatorFactory } from 'typescript-fsa';

const factory = actionCreatorFactory('APP');

export const appStarted = factory('APP_STARTED');
export const bootstrapped = factory('BOOTSTRAPPED');
export const refreshRegionsList = factory('REFRESH_REGIONS_LIST'); // Refreshes RN FlatList
export const splashRemoved = factory('SPLASH_REMOVED');
export const toggleDrawer: ActionCreator<any> = factory('TOGGLE_DRAWER'); // boolean | null

export * from './resetNavigationToHome';
export * from './settingsActions';
