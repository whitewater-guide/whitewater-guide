import clamp from 'lodash/clamp';
import React, { memo, useEffect, useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Animated, StyleSheet, View } from 'react-native';

import theme from '~/theme';

import Thumb, { THUMB_SCALE_RATIO } from './Thumb';
import type { RangeSliderProps } from './types';

// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_V = 5;
const TRACK_EXTRA_MARGIN_H = 5;

const SLIDER_PAGEX = 20;
const SLIDER_WIDTH = theme.screenWidth - 2 * SLIDER_PAGEX;

const TRACK_BACKGROUND_COLOR = theme.colors.componentBorder;
const TRACK_SELECTED_COLOR = theme.colors.primary;
const TRACK_THICKNESS = 2;

const THUMB_RADIUS = 10;

const MARGIN_V =
  THUMB_RADIUS * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_V - TRACK_THICKNESS / 2;
const MARGIN_H = THUMB_RADIUS * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_H;

const styles = StyleSheet.create({
  thumb: {
    top: THUMB_RADIUS * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
  },
  track: {
    marginHorizontal: MARGIN_H,
    marginVertical: MARGIN_V,
    height: 2,
  },
});

const RangeSlider = memo<RangeSliderProps>(
  (props) => {
    const {
      range,
      step,
      behavior = 'continue',
      onChange,
      onChangeEnd,
      values,
    } = props;
    const trackRef = useRef<View>(null);
    const activeThumbRef = useRef<Thumb | null>(null);
    const minThumbRef = useRef<Thumb | null>(null);
    const maxThumbRef = useRef<Thumb | null>(null);
    const valuesPxRef = useRef<[number, number]>([0, 0]);
    const selectedTrackWidthPx = useRef(new Animated.Value(0)).current;
    const selectedTrackLeftPx = useRef(new Animated.Value(0)).current;
    const inverted = useRef(new Animated.Value(0)).current;

    const snap = (valuePx: number): number => {
      const stepPx = (step * SLIDER_WIDTH) / (range[1] - range[0]);
      return Math.round(valuePx / stepPx) * stepPx;
    };

    const constrainValue = (dx: number): number => {
      if (!minThumbRef.current || !maxThumbRef.current) {
        return dx;
      }
      const x = dx - SLIDER_PAGEX;

      let constrainedX = clamp(x, 0, SLIDER_WIDTH);

      if (behavior !== 'invert') {
        // The moment when user drags one thumb over another
        if (
          behavior === 'continue' &&
          minThumbRef.current.x === maxThumbRef.current.x
        ) {
          if (x > maxThumbRef.current.x) {
            // Drag min thumb to the right over max thumb
            activeThumbRef.current = maxThumbRef.current;
            minThumbRef.current.release(); // Release minThumb, continue with maxThumb
          } else if (x < minThumbRef.current.x) {
            // Drag max thumb to the left over min thumb
            activeThumbRef.current = minThumbRef.current;
            maxThumbRef.current.release(); // Release maxThumb, continue with minThumb
          }
        }

        if (activeThumbRef.current === minThumbRef.current) {
          constrainedX =
            x >= maxThumbRef.current.x ? maxThumbRef.current.x : constrainedX;
        } else {
          constrainedX =
            x <= minThumbRef.current.x ? minThumbRef.current.x : constrainedX;
        }
      }

      return snap(constrainedX);
    };

    const pixelToValue = (px: number): number =>
      (px * (range[1] - range[0])) / SLIDER_WIDTH + range[0];

    const valueToPixel = (value: number): number =>
      (SLIDER_WIDTH * (value - range[0])) / (range[1] - range[0]);

    const setValuesPx = (values: [number, number]): void => {
      valuesPxRef.current = values.map(valueToPixel) as [number, number];
    };

    const changeValues = (value: number): void => {
      const index = activeThumbRef.current === minThumbRef.current ? 0 : 1;
      valuesPxRef.current[index] = value;
      onChange?.(valuesPxRef.current.map(pixelToValue) as [number, number]);
    };

    const moveThumb = (thumb: Thumb, x: number, immediately = false): void => {
      thumb.moveTo(x);
      const left = Math.min(...valuesPxRef.current);
      const width = Math.abs(valuesPxRef.current[1] - valuesPxRef.current[0]);
      const invertedValue =
        valuesPxRef.current[1] < valuesPxRef.current[0] ? 1 : 0;
      if (immediately) {
        selectedTrackLeftPx.setValue(left);
        selectedTrackWidthPx.setValue(width);
        inverted.setValue(invertedValue);
      } else {
        Animated.parallel([
          Animated.timing(selectedTrackLeftPx, {
            toValue: left,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(selectedTrackWidthPx, {
            toValue: width,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(inverted, {
            toValue: invertedValue,
            duration: 0,
            useNativeDriver: false,
          }),
        ]).start();
      }
    };

    const updateThumbs = (immediately = false): void => {
      if (minThumbRef.current) {
        moveThumb(minThumbRef.current, valuesPxRef.current[0], immediately);
        minThumbRef.current.release();
      }

      if (maxThumbRef.current) {
        moveThumb(maxThumbRef.current, valuesPxRef.current[1], immediately);
        maxThumbRef.current.release();
      }
    };

    const onMove = (thumb: Thumb, e: GestureResponderEvent) => {
      const dx = e.nativeEvent.pageX;
      const x = constrainValue(dx);
      if (activeThumbRef.current) {
        changeValues(x);
        moveThumb(activeThumbRef.current, x);
      }
    };

    const onMoveStart = (thumb: Thumb, e: GestureResponderEvent) => {
      activeThumbRef.current = thumb;
      onMove(thumb, e);
    };

    const onMoveEnd = (thumb: Thumb) => {
      const ovrRef = activeThumbRef.current ? activeThumbRef.current : thumb;
      ovrRef.release();
      activeThumbRef.current = null;
      onChangeEnd?.(valuesPxRef.current.map(pixelToValue) as [number, number]);
    };

    useEffect(() => {
      setValuesPx(values);
      updateThumbs();
      // This is fine
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    return (
      <View>
        <View ref={trackRef} collapsable={false} style={styles.track}>
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: TRACK_THICKNESS,
              backgroundColor: inverted.interpolate({
                inputRange: [0, 1],
                outputRange: [TRACK_BACKGROUND_COLOR, TRACK_SELECTED_COLOR],
                extrapolate: 'clamp',
              }),
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              left: selectedTrackLeftPx,
              width: selectedTrackWidthPx,
              height: TRACK_THICKNESS,
              backgroundColor: inverted.interpolate({
                inputRange: [0, 1],
                outputRange: [TRACK_SELECTED_COLOR, TRACK_BACKGROUND_COLOR],
                extrapolate: 'clamp',
              }),
            }}
          />
        </View>

        <Thumb
          ref={minThumbRef}
          radius={THUMB_RADIUS}
          trackMargin={MARGIN_H}
          color={TRACK_SELECTED_COLOR}
          onGrant={onMoveStart}
          onMove={onMove}
          onEnd={onMoveEnd}
          style={styles.thumb}
        />

        <Thumb
          ref={maxThumbRef}
          radius={THUMB_RADIUS}
          trackMargin={MARGIN_H}
          color={TRACK_SELECTED_COLOR}
          onGrant={onMoveStart}
          onMove={onMove}
          onEnd={onMoveEnd}
          style={styles.thumb}
        />
      </View>
    );
  },
  (prev, next) => {
    return (
      prev.values[0] === next.values[0] &&
      prev.values[1] === next.values[1] &&
      prev.onChange === next.onChange &&
      prev.onChangeEnd === next.onChangeEnd &&
      prev.range[0] === next.range[0] &&
      prev.range[1] === next.range[1] &&
      prev.step === next.step &&
      prev.behavior === next.behavior
    );
  },
);

export default RangeSlider;
