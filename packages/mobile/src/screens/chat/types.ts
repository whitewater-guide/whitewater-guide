import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import type {
  RootDrawerParamsList,
  RootStackParamsList,
  Screens,
} from '~/core/navigation';

export type ChatNavProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamsList, Screens.CHAT>,
  StackNavigationProp<RootDrawerParamsList>
>;

export interface ChatNavProps {
  navigation: ChatNavProp;
  route: RouteProp<RootStackParamsList, Screens.CHAT>;
}
