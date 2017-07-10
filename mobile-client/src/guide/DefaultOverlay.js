import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet } from 'react-native';
import { Svg, Defs, G, Circle, ClipPath, Rect } from 'react-native-svg';
import HoleView from './HoleView';

const { width, height } = Dimensions.get('window');

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

  render() {
    const hole = {
      type: 'circle',
      x: this._cx,
      y: this._cy,
      radius: this._radius,
    };
    return (
      <HoleView style={StyleSheet.absoluteFill} hole={hole} pointerEvents="none">
        <Svg width={width} height={height} pointerEvents="none">
          <Defs>
            <ClipPath id="clip">
              <G>
                <Rect width={width} height={height} />
                <Circle cx={this._cx} cy={this._cy} r={this._radius} />
              </G>
            </ClipPath>
          </Defs>
          <Rect
            width={width}
            height={height}
            fill="rgba(255, 0, 0, 0.5)"
            clipPath="url(#clip)"
            clipRule="evenodd"
          />
        </Svg>
      </HoleView>
    );
  }
}
