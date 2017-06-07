import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import clamp from 'lodash/clamp';
import Thumb, { THUMB_SCALE_RATIO } from './Thumb';
import theme from '../../theme';

// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_V = 5;
const TRACK_EXTRA_MARGIN_H = 5;

export default class RangeSlider extends React.PureComponent {
  static propTypes = {
    ...View.propTypes,
    range: PropTypes.arrayOf(PropTypes.number),
    values: PropTypes.arrayOf(PropTypes.number),
    step: PropTypes.number,
    trackThickness: PropTypes.number,
    thumbRadius: PropTypes.number,
    selectedTrackColor: PropTypes.string,
    backgroundTrackColor: PropTypes.string,
    behavior: PropTypes.oneOf(['block', 'continue', 'invert']),
    onChange: PropTypes.func,
    onChangeEnd: PropTypes.func,
  };

  static defaultProps = {
    thumbRadius: 10,
    trackThickness: 2,
    range: [0, 100],
    values: [0, 100],
    step: 1,
    backgroundTrackColor: theme.colors.componentBorder,
    selectedTrackColor: theme.colors.primary,
    behavior: 'continue',
    onChange: null,
    onChangeEnd: null,
  };

  constructor(props) {
    super(props);
    this._valuesPx = [0, 0];

    this._activeThumb = undefined;
    this._trackWidthPx = 0;
    this._trackPageX = 0;
    this._selectedTrackWidthPx = new Animated.Value(0);
    this._selectedTrackLeftPx = new Animated.Value(0);
    this._inverted = new Animated.Value(0);
    this._trackMarginV = props.thumbRadius * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_V - this.props.trackThickness / 2;
    this._trackMarginH = props.thumbRadius * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_H;
    this._trackStyle = StyleSheet.create({
      track: { marginHorizontal: this._trackMarginH, marginVertical: this._trackMarginV, height: 2 }
    });

    // Refs
    this._track = null;
    this._minThumb = null;
    this._maxThumb = null;
  }

  componentWillReceiveProps(nextProps) {
    this.setValuesPx(nextProps);
    this.updateThumbs();
  }

  onTrackLayout = ({ nativeEvent: { layout: { width } } }) => {
    if (this._trackWidthPx !== width) {
      this._trackWidthPx = width;
      this.setValuesPx(this.props);
      this.updateThumbs(true);
    }
    this._track.measure((x, y, w, height, pageX) => {
      this._trackPageX = pageX;
    });
  };

  onMoveStart = (thumb, e) => {
    this._activeThumb = thumb;
    this.onMove(thumb, e);
  };

  onMove = (thumb, e) => {
    const dx = e.nativeEvent.pageX;
    const x = this.constrainValue(dx);
    this.changeValues(x);
    this.moveThumb(this._activeThumb, x);
  };

  onMoveEnd = (thumb) => {
    const ovrRef = this._activeThumb ? this._activeThumb : thumb;
    ovrRef.release();
    this._activeThumb = null;

    if (this.props.onChangeEnd) {
      this.props.onChangeEnd(this._valuesPx.map(this.pixelToValue));
    }
  };

  snap = (valuePx) => {
    const stepPx = this.props.step * this._trackWidthPx / (this.props.range[1] - this.props.range[0]);
    return Math.round(valuePx / stepPx) * stepPx;
  };

  setValuesPx = ({ values }) => {
    this._valuesPx = values.map(this.valueToPixel);
  };

  pixelToValue = px => px * (this.props.range[1] - this.props.range[0]) / this._trackWidthPx + this.props.range[0];
  valueToPixel = value => this._trackWidthPx * (value - this.props.range[0]) / (this.props.range[1] - this.props.range[0]);

  changeValues = (value) => {
    const index = this._activeThumb === this._minThumb ? 0 : 1;
    this._valuesPx[index] = value;
    if (this.props.onChange) {
      this.props.onChange(this._valuesPx.map(this.pixelToValue));
    }
  };

  updateThumbs = (immediately) => {
    this.moveThumb(this._minThumb, this._valuesPx[0], immediately);
    this._minThumb.release(this._valuesPx[0]);

    this.moveThumb(this._maxThumb, this._valuesPx[1], immediately);
    this._maxThumb.release(this._valuesPx[1]);
  };

  constrainValue = (dx) => {
    const { behavior } = this.props;

    const x = dx - this._trackPageX;

    let constrainedX = clamp(x, 0, this._trackWidthPx);

    if (behavior !== 'invert') {
      // The moment when user drags one thumb over another
      if (behavior === 'continue' && this._minThumb.x === this._maxThumb.x) {
        if (x > this._maxThumb.x) { // Drag min thumb to the right over max thumb
          this._activeThumb = this._maxThumb;
          this._minThumb.release();// Release minThumb, continue with maxThumb
        } else if (x < this._minThumb.x) { // Drag max thumb to the left over min thumb
          this._activeThumb = this._minThumb;
          this._maxThumb.release();// Release maxThumb, continue with minThumb
        }
      }

      if (this._activeThumb === this._minThumb) {
        constrainedX = x >= this._maxThumb.x ? this._maxThumb.x : constrainedX;
      } else {
        constrainedX = x <= this._minThumb.x ? this._minThumb.x : constrainedX;
      }
    }

    return this.snap(constrainedX);
  };

  moveThumb = (thumb, x, immediately) => {
    thumb.moveTo(x);
    const left = Math.min(...this._valuesPx);
    const width = Math.abs(this._valuesPx[1] - this._valuesPx[0]);
    const inverted = this._valuesPx[1] < this._valuesPx[0] ? 1 : 0;
    if (immediately) {
      this._selectedTrackLeftPx.setValue(left);
      this._selectedTrackWidthPx.setValue(width);
      this._inverted.setValue(inverted);
    } else {
      Animated.parallel([
        Animated.timing(this._selectedTrackLeftPx, { toValue: left, duration: 0 }),
        Animated.timing(this._selectedTrackWidthPx, { toValue: width, duration: 0 }),
        Animated.timing(this._inverted, { toValue: inverted, duration: 0 }),
      ]).start();
    }
  };

  setTrack = (track) => { this._track = track; };
  setMinThumb = (minRange) => { this._minThumb = minRange; };
  setMaxThumb = (maxRange) => { this._maxThumb = maxRange; };

  render() {
    const { selectedTrackColor, backgroundTrackColor, thumbRadius } = this.props;
    return (
      <View>
        <View ref={this.setTrack} onLayout={this.onTrackLayout} collapsible={false} style={this._trackStyle.track}>
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: this.props.trackThickness,
              backgroundColor: this._inverted.interpolate({
                inputRange: [0, 1],
                outputRange: [backgroundTrackColor, selectedTrackColor],
                extrapolate: 'clamp',
              }),
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              left: this._selectedTrackLeftPx,
              width: this._selectedTrackWidthPx,
              height: this.props.trackThickness,
              backgroundColor: this._inverted.interpolate({
                inputRange: [0, 1],
                outputRange: [selectedTrackColor, backgroundTrackColor],
                extrapolate: 'clamp',
              }),
            }}
          />
        </View>
        <Thumb
          ref={this.setMinThumb}
          radius={this.props.thumbRadius}
          trackMargin={this._trackMarginH}
          color={selectedTrackColor}
          onGrant={this.onMoveStart}
          onMove={this.onMove}
          onEnd={this.onMoveEnd}
          style={{
            top: thumbRadius * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
        />

        <Thumb
          ref={this.setMaxThumb}
          radius={this.props.thumbRadius}
          trackMargin={this._trackMarginH}
          color={selectedTrackColor}
          onGrant={this.onMoveStart}
          onMove={this.onMove}
          onEnd={this.onMoveEnd}
          style={{
            top: thumbRadius * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
        />
      </View>
    );
  }
}
