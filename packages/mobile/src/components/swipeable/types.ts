import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export interface SwipeableProps {
  id: string;
  snapPoint: number;
  style?: StyleProp<ViewStyle>;
  renderOverlay: (position: SharedValue<number>) => ReactElement;
  overlayStyle?: StyleProp<ViewStyle>;
  renderUnderlay: (position: SharedValue<number>) => ReactElement;
  underlayStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export interface SwipeableMethods {
  open: () => Promise<void>;
  close: () => Promise<void>;
}
