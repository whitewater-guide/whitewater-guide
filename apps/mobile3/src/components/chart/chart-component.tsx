import { Line as SkLine, matchFont } from '@shopify/react-native-skia';
import {
  Children,
  Fragment,
  isValidElement,
  type ReactNode,
  useMemo,
} from 'react';
import { Platform, Text, View } from 'react-native';
import {
  CartesianChart,
  Line,
  Scatter,
  useChartPressState,
} from 'victory-native';

import { CHART_COLORS } from './chart-colors';
import {
  type ChartGeometry,
  ChartGeometryProvider,
  ChartOverlay,
  ChartSkiaLayer,
} from './chart-geometry-context';
import { Crosshair } from './crosshair';
import { getColorForValue } from './get-color-for-value';
import { HorizontalGrid } from './horizontal-grid';
import { HorizontalTick } from './horizontal-tick';
import { makeLinearScale, type VChartPoint } from './math';
import { TimeGrid } from './time-grid';
import type { ChartViewProps } from './types';
import { useChartComputations } from './use-chart-computations';

const FONT_FAMILY =
  Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif' }) ??
  'sans-serif';

const SKIA_FONT_STYLE = { fontFamily: FONT_FAMILY, fontSize: 10 } as const;

const CHART_PADDING = { top: 20, bottom: 50, left: 48, right: 32 } as const;

export interface ChartComponentConfig {
  labelRotate?: number;
  xTickIntervalMs?: number;
  formatXLabel?: (ts: number, days: number) => string;
  longPressDelay?: number;
  children?: ReactNode;
}

export type ChartComponentProps = ChartViewProps & ChartComponentConfig;

export function ChartComponent({
  data,
  unit,
  gauge,
  section,
  filter,
  width,
  height,
  labelRotate = 45,
  xTickIntervalMs,
  formatXLabel,
  longPressDelay = 500,
  children,
}: ChartComponentProps) {
  const font = useMemo(() => matchFont(SKIA_FONT_STYLE), []);

  const {
    binding,
    yDomain,
    yTickValues,
    xDomain,
    days,
    rawSeparators,
    chartData,
    formatX,
  } = useChartComputations({ data, unit, section, filter });

  const { state: pressState, isActive } = useChartPressState({
    x: 0,
    y: { value: 0 },
  });

  const boundsLeft = CHART_PADDING.left;
  const boundsRight = width - CHART_PADDING.right;
  const boundsTop = CHART_PADDING.top;

  const tsToX = useMemo(
    () => makeLinearScale(xDomain, [boundsLeft, boundsRight]),
    [xDomain, boundsLeft, boundsRight],
  );

  const xTickValues = useMemo(() => {
    const intervalMs =
      xTickIntervalMs ??
      (days <= 1
        ? 3 * 3_600_000
        : days <= 3
          ? 12 * 3_600_000
          : days <= 7
            ? 86_400_000
            : 7 * 86_400_000);
    const first = Math.ceil(xDomain[0] / intervalMs) * intervalMs;
    const ticks: number[] = [];
    for (let ts = first; ts <= xDomain[1]; ts += intervalMs) {
      ticks.push(ts);
    }
    return ticks;
  }, [xDomain, days, xTickIntervalMs]);

  const formatXOverride = useMemo(
    () => (formatXLabel ? (ts: number) => formatXLabel(ts, days) : formatX),
    [formatXLabel, formatX, days],
  );

  const xLabelRotateOffset = useMemo(() => {
    if (!labelRotate || !font) return 0;
    let max = 0;
    for (const ts of xTickValues) {
      const label = String(formatXOverride(ts));
      const glyphIds = font.getGlyphIDs(label);
      const widths = font.getGlyphWidths?.(glyphIds) ?? [];
      const total = widths.reduce((s, w) => s + w, 0);
      if (total > max) max = total;
    }
    return Math.abs(max * Math.sin((Math.PI / 180) * labelRotate));
  }, [labelRotate, font, xTickValues, formatXOverride]);

  const boundsBottom = height - CHART_PADDING.bottom - xLabelRotateOffset;

  const valueToY = useMemo(
    () =>
      makeLinearScale(
        [yDomain[1], yDomain[0]],
        [boundsTop, boundsBottom],
      ),
    [yDomain, boundsTop, boundsBottom],
  );

  const separators = useMemo(
    () => rawSeparators.map(({ date, ts }) => ({ date, xPixel: tsToX(ts) })),
    [rawSeparators, tsToX],
  );

  const { skiaSlotChildren, overlaySlotChildren } = useMemo(() => {
    const skia: ReactNode[] = [];
    const overlay: ReactNode[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      if (child.type === ChartSkiaLayer) {
        skia.push((child.props as { children?: ReactNode }).children);
      } else if (child.type === ChartOverlay) {
        overlay.push((child.props as { children?: ReactNode }).children);
      }
    });
    return { skiaSlotChildren: skia, overlaySlotChildren: overlay };
  }, [children]);

  const overlayGeometry: ChartGeometry | null = useMemo(() => {
    if (overlaySlotChildren.length === 0) return null;
    return {
      chartBounds: {
        left: boundsLeft,
        right: boundsRight,
        top: boundsTop,
        bottom: boundsBottom,
      },
      tsToX,
      valueToY,
      boundsLeft,
      boundsRight,
      boundsTop,
      boundsBottom,
      width,
      height,
    };
  }, [
    overlaySlotChildren.length,
    boundsLeft,
    boundsRight,
    boundsTop,
    boundsBottom,
    tsToX,
    valueToY,
    width,
    height,
  ]);

  return (
    <View style={{ width, height }}>
      <CartesianChart<VChartPoint, 'ts', 'value'>
        data={chartData}
        xKey="ts"
        yKeys={['value']}
        domain={{ x: xDomain, y: yDomain }}
        xAxis={{
          font,
          formatXLabel: formatXOverride,
          labelColor: CHART_COLORS.label,
          lineWidth: 0,
          tickValues: xTickValues,
          tickCount: xTickValues.length,
          labelRotate,
        }}
        yAxis={[
          {
            yKeys: ['value'],
            font: null,
            tickValues: yTickValues,
            lineWidth: 0,
          },
        ]}
        chartPressState={pressState}
        chartPressConfig={{
          pan: {
            activateAfterLongPress: longPressDelay,
            failOffsetY: [-25, 25],
          },
        }}
        padding={CHART_PADDING}
      >
        {({ points, chartBounds }) => (
          <>
            <SkLine
              p1={{ x: chartBounds.left, y: chartBounds.top }}
              p2={{ x: chartBounds.left, y: chartBounds.bottom }}
              color={CHART_COLORS.axisLine}
              strokeWidth={1}
            />
            <SkLine
              p1={{ x: chartBounds.left, y: chartBounds.bottom }}
              p2={{ x: chartBounds.right, y: chartBounds.bottom }}
              color={CHART_COLORS.axisLine}
              strokeWidth={1}
            />

            <TimeGrid
              separators={separators}
              chartBounds={chartBounds}
              days={days}
            />

            {skiaSlotChildren.length > 0 && (
              <ChartGeometryProvider
                value={{
                  chartBounds,
                  tsToX,
                  valueToY,
                  boundsLeft,
                  boundsRight,
                  boundsTop,
                  boundsBottom,
                  width,
                  height,
                }}
              >
                {skiaSlotChildren}
              </ChartGeometryProvider>
            )}

            {yTickValues.map((tickValue) => {
              const yPx = valueToY(tickValue);
              const color = getColorForValue(
                tickValue,
                binding,
                CHART_COLORS.gridLine,
              );
              const isBinding =
                tickValue === binding?.minimum ||
                tickValue === binding?.optimum ||
                tickValue === binding?.maximum ||
                tickValue === binding?.impossible;

              return (
                <Fragment key={tickValue}>
                  <HorizontalGrid
                    y={yPx}
                    color={
                      color === CHART_COLORS.gridLine
                        ? CHART_COLORS.axisLine
                        : color
                    }
                    chartBounds={chartBounds}
                    isBinding={isBinding}
                  />
                  <HorizontalTick
                    y={yPx}
                    color={
                      color === CHART_COLORS.gridLine
                        ? CHART_COLORS.axisLine
                        : color
                    }
                    chartBounds={chartBounds}
                  />
                </Fragment>
              );
            })}

            <Line
              points={points.value}
              color={CHART_COLORS.line}
              strokeWidth={2}
            />

            <Scatter
              points={points.value}
              color={CHART_COLORS.line}
              radius={3}
            />

            {isActive && (
              <Crosshair
                x={pressState.x.position}
                y={pressState.y.value.position}
                xValue={pressState.x.value}
                yValue={pressState.y.value.value}
                chartBounds={chartBounds}
                unit={unit}
                gauge={gauge}
                font={font}
              />
            )}
          </>
        )}
      </CartesianChart>

      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, width, height }}
      >
        {yTickValues.map((tickValue) => {
          const yPx = valueToY(tickValue);
          const color = getColorForValue(
            tickValue,
            binding,
            CHART_COLORS.gridLine,
          );
          const labelColor =
            color === CHART_COLORS.gridLine ? CHART_COLORS.label : color;
          const text = String(parseFloat(tickValue.toFixed(2)));
          const bindingLabel =
            tickValue === binding?.minimum
              ? 'min'
              : tickValue === binding?.optimum
                ? 'opt'
                : tickValue === binding?.maximum
                  ? 'max'
                  : tickValue === binding?.impossible
                    ? 'imp'
                    : undefined;

          return (
            <Fragment key={tickValue}>
              <Text
                style={{
                  position: 'absolute',
                  top: yPx - 6,
                  left: 0,
                  width: CHART_PADDING.left - 4,
                  textAlign: 'right',
                  fontSize: 10,
                  color: labelColor,
                  lineHeight: 12,
                }}
              >
                {text}
              </Text>

              {!!bindingLabel && (
                <Text
                  style={{
                    position: 'absolute',
                    top: yPx - 6,
                    left: boundsRight + 4,
                    fontSize: 10,
                    color,
                    lineHeight: 12,
                  }}
                >
                  {bindingLabel}
                </Text>
              )}
            </Fragment>
          );
        })}

        {overlayGeometry && (
          <ChartGeometryProvider value={overlayGeometry}>
            {overlaySlotChildren}
          </ChartGeometryProvider>
        )}
      </View>
    </View>
  );
}
