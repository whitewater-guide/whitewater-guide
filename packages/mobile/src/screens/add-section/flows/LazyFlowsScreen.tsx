import { register } from 'react-native-bundle-splitter';

export const LazyFlowsScreen = register({
  loader: () => import('./FlowsScreen'),
});
