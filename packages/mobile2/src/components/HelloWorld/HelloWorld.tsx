import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';

interface HelloWorldProps {
  name?: string;
}

const HelloWorld = ({ name = 'World' }: HelloWorldProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap().onStart(() => {
    scale.value = withSpring(scale.value === 1 ? 1.5 : 1);
  });

  return (
    <View style={styles.container}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="blue"
          strokeWidth="2.5"
          fill="green"
        />
        <Rect
          x="15"
          y="15"
          width="70"
          height="70"
          stroke="red"
          strokeWidth="2"
          fill="yellow"
          opacity={0.5}
        />
      </Svg>

      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Text style={styles.boxText}>Tap me!</Text>
        </Animated.View>
      </GestureDetector>

      <Text style={styles.text}>Hello, {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  box: {
    width: 80,
    height: 80,
    backgroundColor: '#b58df1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 24,
  },
});

export default HelloWorld;
