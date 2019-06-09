import { actionCreatorFactory } from 'typescript-fsa';

const factory = actionCreatorFactory('APP');

export const appStarted = factory('APP_STARTED');
export const bootstrapped = factory('BOOTSTRAPPED');
export const refreshRegionsList = factory('REFRESH_REGIONS_LIST'); // Refreshes RN FlatList

export * from './resetNavigationToHome';
export * from './settingsActions';
