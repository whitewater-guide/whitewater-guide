import { register } from 'react-native-bundle-splitter';

export const LazyFlowsScreen = register({
  require: () => require('./FlowsScreen'),
});
