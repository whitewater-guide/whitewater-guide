import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Svg, Defs, G, Circle, ClipPath, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
});

export class DefaultOverlay extends React.PureComponent {
  static propTypes = {
    layout: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    padding: PropTypes.number,
  };
  
  static defaultProps = {
    padding: 2,
  };
  
  componentWillMount() {
    this.computeLayout(this.props);
  }
  
  componentWillReceiveProps(nextProps) {
    this.computeLayout(nextProps);
  }
  
  computeLayout = (props) => {
    const { layout, padding } = props;
    this._cx = layout.x + layout.width / 2;
    this._cy = layout.y + layout.height / 2;
    this._radius = 0.707106781 * Math.max(layout.width, layout.height) + padding;
  };
  
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
    const dx = pageX - this._cx;
    const dy = pageY - this._cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    console.log('Is Inside', distance > this._radius);
    // return distance < this._radius;
    return true;
  };

  render() {
    return (
      <View
        style={styles.overlay}
        onMoveShouldSetResponder={this.onMoveShouldSetResponder}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
        onMoveShouldSetResponderCapture={this.onMoveShouldSetResponderCapture}
        onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}
        pointerEvents="box-none"
      >
        <Svg width={width} height={height}>
          <Defs>
            <ClipPath id="clip">
              <G>
                <Rect width={width} height={height}/>
                <Circle cx={this._cx} cy={this._cy} r={this._radius} />
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
