import React, { PropTypes } from 'react';
import { Text, G } from 'react-native-svg';
import { VictoryLabel } from 'victory-core/src';
import { NativeHelpers } from 'victory-native';
import moment from 'moment';

export default class extends VictoryLabel {
  static defaultProps = {
    ...VictoryLabel.defaultProps,
    capHeight: 0.71,
    lineHeight: 1,
    period: PropTypes.oneOf(['daily', 'weekly', 'monthly']),
  };

  shouldRender = () => {
    const { period, datum } = this.props;
    if (period === 'monthly') {
      return moment(datum).day() === 0; // Only render sundays
    }
    return true;
  };

  // Overrides method in victory-core
  renderElements(props) {
    if (!this.shouldRender()){
      return null;
    }
    const { x, y, dx, className, events } = props;
    const transform = NativeHelpers.getTransform(this.transform);
    return (
      <G {...transform} {...events} originX={x} originY={y} className={className}>
        {this.content.map((line, i) => {
          const style = NativeHelpers.getStyle(this.style[i] || this.style[0]);
          const lastStyle = NativeHelpers.getStyle(this.style[i - 1] || this.style[0]);
          const fontSize = (style.fontSize + lastStyle.fontSize) / 2;
          const textAnchor = style.textAnchor || this.textAnchor;
          const lineOffset = i ? fontSize : 0;
          const dy = this.dy - fontSize + lineOffset;
          return (
            <Text {...style} key={i} x={x + 10} y={y - 7} dx={dx} dy={dy} textAnchor={textAnchor}>
              {line}
            </Text>
          );
        })}
      </G>
    );
  }
}
