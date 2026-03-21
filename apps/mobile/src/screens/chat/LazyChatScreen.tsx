import { register } from 'react-native-bundle-splitter';

export const LazyChatScreen = register({
  loader: () => import('./ChatScreen'),
});
