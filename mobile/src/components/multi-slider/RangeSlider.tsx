import clamp from 'lodash/clamp';
import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  InteractionManager,
  LayoutChangeEvent,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';

import theme from '../../theme';
import Thumb, { THUMB_SCALE_RATIO } from './Thumb';

// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_V = 5;
const TRACK_EXTRA_MARGIN_H = 5;

export interface RangeSliderProps extends ViewProps {
  range?: [number, number]; // defaultProps
  values: [number, number];
  step?: number; // defaultProps
  trackThickness?: number; // defaultProps
  thumbRadius?: number; // defaultProps
  selectedTrackColor?: string; // defaultProps
  backgroundTrackColor?: string; // defaultProps
  behavior?: 'block' | 'continue' | 'invert'; // defaultProps
  onChange?: (values: [number, number]) => void;
  onChangeEnd?: (values: [number, number]) => void;
  defaultTrackWidth?: number;
  defaultTrackPageX?: number;
}

export class RangeSlider extends React.PureComponent<RangeSliderProps> {
  static defaultProps: Partial<RangeSliderProps> = {
    thumbRadius: 10,
    trackThickness: 2,
    range: [0, 100],
    step: 1,
    backgroundTrackColor: theme.colors.componentBorder,
    selectedTrackColor: theme.colors.primary,
    behavior: 'continue',
  };

  _valuesPx: [number, number] = [0, 0];
  _trackWidthPx = 0;
  _trackPageX = 0;
  _selectedTrackWidthPx: Animated.Value = new Animated.Value(0);
  _selectedTrackLeftPx: Animated.Value = new Animated.Value(0);
  _inverted: Animated.Value = new Animated.Value(0);
  _trackMarginV: number;
  _trackMarginH: number;
  _trackStyle: any;

  _activeThumb: Thumb | null = null;
  _minThumb: Thumb | null = null;
  _maxThumb: Thumb | null = null;
  _track: View | null = null;

  constructor(props: RangeSliderProps) {
    super(props);

    this._trackMarginV =
      props.thumbRadius! * THUMB_SCALE_RATIO +
      TRACK_EXTRA_MARGIN_V -
      props.trackThickness! / 2;
    this._trackMarginH =
      props.thumbRadius! * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_H;
    this._trackStyle = StyleSheet.create({
      track: {
        marginHorizontal: this._trackMarginH,
        marginVertical: this._trackMarginV,
        height: 2,
      },
    });
  }

  componentDidMount() {
    const { defaultTrackPageX, defaultTrackWidth } = this.props;
    if (defaultTrackPageX && defaultTrackWidth) {
      this._trackPageX = defaultTrackPageX;
      this._trackWidthPx = defaultTrackWidth;
      this.setValuesPx(this.props);
      this.updateThumbs();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: RangeSliderProps) {
    this.setValuesPx(nextProps);
    this.updateThumbs();
  }

  onTrackLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    // InteractionManager.runAfterInteractions is required because when RangeSlider is inside animated StackScreen
    // initial measurements get screwed
    InteractionManager.runAfterInteractions(() => {
      if (this._trackWidthPx !== width) {
        this._trackWidthPx = width;
        this.setValuesPx(this.props);
        this.updateThumbs(true);
      }
      this._track!.measure((x, y, w, h, pageX) => {
        this._trackPageX = pageX;
      });
    });
  };

  onMoveStart = (thumb: Thumb, e: GestureResponderEvent) => {
    this._activeThumb = thumb;
    this.onMove(thumb, e);
  };

  onMove = (thumb: Thumb, e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX;
    const x = this.constrainValue(dx);
    this.changeValues(x);
    this.moveThumb(this._activeThumb!, x);
  };

  onMoveEnd = (thumb: Thumb) => {
    const ovrRef = this._activeThumb ? this._activeThumb : thumb;
    ovrRef.release();
    this._activeThumb = null;

    if (this.props.onChangeEnd) {
      this.props.onChangeEnd(this._valuesPx.map(this.pixelToValue) as any);
    }
  };

  snap = (valuePx: number) => {
    const stepPx =
      (this.props.step! * this._trackWidthPx) /
      (this.props.range![1] - this.props.range![0]);
    return Math.round(valuePx / stepPx) * stepPx;
  };

  setValuesPx = ({ values }: RangeSliderProps) => {
    this._valuesPx = values.map(this.valueToPixel) as any;
  };

  pixelToValue = (px: number) =>
    (px * (this.props.range![1] - this.props.range![0])) / this._trackWidthPx +
    this.props.range![0];

  valueToPixel = (value: number) =>
    (this._trackWidthPx * (value - this.props.range![0])) /
    (this.props.range![1] - this.props.range![0]);

  changeValues = (value: number) => {
    const index = this._activeThumb === this._minThumb ? 0 : 1;
    this._valuesPx[index] = value;
    if (this.props.onChange) {
      this.props.onChange(this._valuesPx.map(this.pixelToValue) as any);
    }
  };

  updateThumbs = (immediately = false) => {
    if (this._minThumb) {
      this.moveThumb(this._minThumb, this._valuesPx[0], immediately);
      this._minThumb.release();
    }

    if (this._maxThumb) {
      this.moveThumb(this._maxThumb, this._valuesPx[1], immediately);
      this._maxThumb.release();
    }
  };

  constrainValue = (dx: number) => {
    if (!this._minThumb || !this._maxThumb) {
      return dx;
    }
    const { behavior } = this.props;

    const x = dx - this._trackPageX;

    let constrainedX = clamp(x, 0, this._trackWidthPx);

    if (behavior !== 'invert') {
      // The moment when user drags one thumb over another
      if (behavior === 'continue' && this._minThumb.x === this._maxThumb.x) {
        if (x > this._maxThumb.x) {
          // Drag min thumb to the right over max thumb
          this._activeThumb = this._maxThumb;
          this._minThumb.release(); // Release minThumb, continue with maxThumb
        } else if (x < this._minThumb.x) {
          // Drag max thumb to the left over min thumb
          this._activeThumb = this._minThumb;
          this._maxThumb.release(); // Release maxThumb, continue with minThumb
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

  moveThumb = (thumb: Thumb, x: number, immediately = false) => {
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
        Animated.timing(this._selectedTrackLeftPx, {
          toValue: left,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(this._selectedTrackWidthPx, {
          toValue: width,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(this._inverted, {
          toValue: inverted,
          duration: 0,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  setTrack = (track: View | null) => {
    this._track = track;
  };
  setMinThumb = (thumb: Thumb | null) => {
    this._minThumb = thumb;
  };
  setMaxThumb = (thumb: Thumb | null) => {
    this._maxThumb = thumb;
  };

  render() {
    const {
      selectedTrackColor,
      backgroundTrackColor,
      thumbRadius,
      defaultTrackWidth,
      defaultTrackPageX,
    } = this.props;
    const onTrackLayout =
      defaultTrackWidth && defaultTrackPageX ? undefined : this.onTrackLayout;
    return (
      <View>
        <View
          ref={this.setTrack}
          onLayout={onTrackLayout}
          collapsable={false}
          style={this._trackStyle.track}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: this.props.trackThickness,
              backgroundColor: this._inverted.interpolate({
                inputRange: [0, 1],
                outputRange: [backgroundTrackColor!, selectedTrackColor!],
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
                outputRange: [selectedTrackColor!, backgroundTrackColor!],
                extrapolate: 'clamp',
              }),
            }}
          />
        </View>
        <Thumb
          ref={this.setMinThumb}
          radius={this.props.thumbRadius!}
          trackMargin={this._trackMarginH}
          color={selectedTrackColor!}
          onGrant={this.onMoveStart}
          onMove={this.onMove}
          onEnd={this.onMoveEnd}
          style={{
            top: thumbRadius! * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
        />

        <Thumb
          ref={this.setMaxThumb}
          radius={this.props.thumbRadius!}
          trackMargin={this._trackMarginH}
          color={selectedTrackColor!}
          onGrant={this.onMoveStart}
          onMove={this.onMove}
          onEnd={this.onMoveEnd}
          style={{
            top: thumbRadius! * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
        />
      </View>
    );
  }
}
