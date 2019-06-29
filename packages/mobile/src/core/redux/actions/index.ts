import { actionCreatorFactory } from 'typescript-fsa';

const factory = actionCreatorFactory('APP');

export const refreshRegionsList = factory('REFRESH_REGIONS_LIST'); // Refreshes RN FlatList

export * from './resetNavigationToHome';
