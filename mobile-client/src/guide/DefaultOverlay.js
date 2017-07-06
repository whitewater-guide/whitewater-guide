import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Svg, Defs, G, Circle, ClipPath, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  hole: {
    position: 'absolute',
    backgroundColor: 'rgba(0,255,0,0.5)',
    left: (width - 100) / 2,
    width: 100,
    top: (height - 100) / 2,
    height: 100,
    borderRadius: 50,
  },
});

export class DefaultOverlay extends React.PureComponent {
  onMoveShouldSetResponder = ({ nativeEvent }) => {
    return this.isInside(nativeEvent);
  };

  onStartShouldSetResponder = ({ nativeEvent }) => {
    return this.isInside(nativeEvent);
  };

  onMoveShouldSetResponderCapture = ({ nativeEvent }) => {
    return this.isInside(nativeEvent);
  };

  onStartShouldSetResponderCapture = ({ nativeEvent }) => {
    return this.isInside(nativeEvent);
  };

  isInside = ({ pageX, pageY }) => {
    const dx = pageX - width / 2;
    const dy = pageY - height / 2;
    const result = Math.sqrt(dx * dx + dy * dy) < 50;
    console.log(result);
    return result;
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Svg width={width} height={height} pointerEvents="box-only">
          <Defs>
            <ClipPath id="clip">
              <G>
                <Rect width={width} height={height}/>
                <Circle cx="30" cy="30" r="20"/>
              </G>
            </ClipPath>
          </Defs>
          <Rect
            width={width} height={height}
            fill="rgba(255, 0, 0, 0.5)"
            clipPath="url(#clip)"
            clipRule="evenodd"
          />
        </Svg>
      </View>
    );
  }
}
