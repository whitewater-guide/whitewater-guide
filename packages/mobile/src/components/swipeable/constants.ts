import { WithSpringConfig } from 'react-native-reanimated';

export const SPRING_CONFIG: WithSpringConfig = {
  restSpeedThreshold: 1.7,
  restDisplacementThreshold: 0.4,
  damping: 20,
  mass: 0.2,
  stiffness: 100,
  overshootClamping: false,
};
