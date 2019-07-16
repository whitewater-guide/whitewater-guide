import { AsyncStorage } from 'react-native';
import { PersistConfig } from 'redux-persist';
// @ts-ignore
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

export const persistConfig: PersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['settings'],
};
