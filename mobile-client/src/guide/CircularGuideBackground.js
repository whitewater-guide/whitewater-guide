import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions } from 'react-native';

const window = Dimensions.get('window');
const radius = Math.min(window.width, window.height) / 2 - 1;

export class CircularGuideBackground extends React.PureComponent {
  static propTypes = {
    layout: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
    }).isRequired,
    completeGuideStep: PropTypes.func.isRequired,
    color: PropTypes.string,
    offset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  };

  static defaultProps = {
    color: '#000',
    offset: {
      x: 0,
      y: 0,
    },
  };

  constructor(props) {
    super(props);
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.animated, { duration: 200, toValue: 1, useNativeDriver: true }).start();
  }

  render() {
    const { layout, color, offset } = this.props;
    const center = { x: layout.x + layout.width / 2 - offset.x, y: layout.y + layout.height / 2 - offset.y };
    const circle = {
      position: 'absolute',
      top: center.y - radius,
      left: center.x - radius,
      width: 2 * radius,
      height: 2 * radius,
      borderRadius: radius,
      backgroundColor: color,
      transform: [{
        // Circle should be less than window in size, but scale can be bigger than 1
        scale: this.animated.interpolate({ inputRange: [0, 1], outputRange: [0, 4], extrapolate: 'clamp' }),
      }],
      opacity: this.animated.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3], extrapolate: 'clamp' }),
    };
    return (
      <Animated.View style={circle} pointerEvents="box-none" collapsable={false} />
    );
  };
}
