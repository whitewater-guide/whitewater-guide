import { Line as SkLine, matchFont } from '@shopify/react-native-skia';
import type { ChartViewProps } from '@whitewater-guide/clients';
import { getColorForValue } from '@whitewater-guide/clients';
import React, { Children, useMemo } from 'react';
import { Platform, Text, View } from 'react-native';
import {
  CartesianChart,
  Line,
  Scatter,
  useChartPressState,
} from 'victory-native';

import {
  type ChartGeometry,
  ChartGeometryProvider,
  ChartOverlay,
  ChartSkiaLayer,
} from './ChartGeometryContext';
import { Crosshair } from './Crosshair';
import { HorizontalGrid } from './HorizontalGrid';
import { HorizontalTick } from './HorizontalTick';
import { makeLinearScale, type VChartPoint } from './math';
import { TimeGrid } from './TimeGrid';
import { useChartComputations } from './useChartComputations';
import { CHART_COLORS } from './VictoryTheme';

// ─── Font ────────────────────────────────────────────────────────────────────

// On Android, Skia's system font manager resolves generic CSS family names
// ('sans-serif') but may fail to resolve named families like 'Roboto', which
// makes matchFamilyStyle return null and Skia.Font(null) produce invisible glyphs.
const FONT_FAMILY =
  Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif' }) ??
  'sans-serif';

// RNFontStyle in Skia v2 uses 'fontFamily', not 'familyName'
const SKIA_FONT_STYLE = { fontFamily: FONT_FAMILY, fontSize: 10 } as const;

// ─── Layout ──────────────────────────────────────────────────────────────────

// CartesianChart clips its children render prop to chartBounds via a Skia
// Group clip. Labels in the padding area must therefore be rendered as React
// Native Text views positioned absolutely over the chart.
const CHART_PADDING = { top: 20, bottom: 50, left: 48, right: 32 } as const;

// ─── Component ───────────────────────────────────────────────────────────────

export interface ChartComponentConfig {
  labelRotate?: number;
  xTickIntervalMs?: number;
  formatXLabel?: (ts: number, days: number) => string;
  longPressDelay?: number;
  children?: React.ReactNode;
}

/**
 * Core chart component for the v41 (Skia-based) victory-native API.
 *
 * Renders a `CartesianChart` with:
 * - Time x-axis with day-separator lines and adaptive labels (TimeGrid)
 * - Y-axis with binding-coloured grid lines (HorizontalGrid/Tick)
 * - Y-axis numeric labels and binding labels rendered as RN Views (outside clip)
 * - Measurement data as a `Line` + `Scatter` series
 * - Interactive crosshair on touch (Crosshair + useChartPressState)
 *
 * Callers can extend the visuals via two slot components:
 * - <ChartSkiaLayer> — Skia primitives drawn inside the clipped plot area
 * - <ChartOverlay>   — RN views drawn in the absolute overlay (not clipped)
 * Both have access to `useChartGeometry()` for chart bounds and scale helpers.
 */
function ChartComponent({
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
}: ChartViewProps & ChartComponentConfig) {
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

  // ─── Pre-compute geometry ──────────────────────────────────────────────────
  // These mirror CartesianChart's internal chartBounds exactly, allowing label
  // positions to be computed outside CartesianChart's clip group.

  const boundsLeft = CHART_PADDING.left;
  const boundsRight = width - CHART_PADDING.right;
  const boundsTop = CHART_PADDING.top;

  const tsToX = useMemo(
    () => makeLinearScale(xDomain, [boundsLeft, boundsRight]),
    [xDomain, boundsLeft, boundsRight],
  );

  // X-axis tick values rounded to clean hour intervals so labels show e.g.
  // 15:00 / 18:00 / 21:00 rather than arbitrary fractions of the domain.
  const xTickValues = useMemo(() => {
    const intervalMs =
      xTickIntervalMs ??
      (days <= 1
        ? 3 * 3_600_000 // 3 h  → ~8 ticks, "HH:mm"
        : days <= 3
          ? 12 * 3_600_000 // 12 h → ~6 ticks, "d MMM"/"HH:mm" mixed
          : days <= 7
            ? 86_400_000 // 24 h  → ~7 ticks, "d MMM"
            : 7 * 86_400_000); // 7 days → ~4 ticks, "d MMM"
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

  // victory-native shrinks the y-scale's pixel range by
  // `maxXLabelWidth * |sin(labelRotate)|` to reserve space for rotated x-axis
  // labels (transformInputData.ts:148). We must mirror the same shrink on our
  // valueToY, otherwise its data scale and our valueToY diverge vertically.
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

  const boundsBottom =
    height - CHART_PADDING.bottom - xLabelRotateOffset;

  const valueToY = useMemo(
    () =>
      makeLinearScale(
        [yDomain[1], yDomain[0]], // inverted: larger value → smaller y pixel
        [boundsTop, boundsBottom],
      ),
    [yDomain, boundsTop, boundsBottom],
  );

  const separators = useMemo(
    () => rawSeparators.map(({ date, ts }) => ({ date, xPixel: tsToX(ts) })),
    [rawSeparators, tsToX],
  );

  // Partition slot children: extract inner children of <ChartSkiaLayer> and
  // <ChartOverlay> so they can be rendered in the correct layer.
  const { skiaSlotChildren, overlaySlotChildren } = useMemo(() => {
    const skia: React.ReactNode[] = [];
    const overlay: React.ReactNode[] = [];
    Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      if (child.type === ChartSkiaLayer) {
        skia.push((child.props as { children?: React.ReactNode }).children);
      } else if (child.type === ChartOverlay) {
        overlay.push((child.props as { children?: React.ReactNode }).children);
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
          // lineWidth: 0 disables the full-height vertical lines CartesianChart
          // draws at every tick position; axis labels still render.
          lineWidth: 0,
          tickValues: xTickValues,
          // Disable downsampling — we generate exactly the right tick count above
          tickCount: xTickValues.length,
          labelRotate,
        }}
        yAxis={[
          {
            yKeys: ['value'],
            // Custom labels are drawn as RN Text views below; disable built-in
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
            {/* Day-separator vertical lines + day boundary label */}
            {/* Axis border lines */}
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

            {/* Binding-coloured horizontal grid lines and axis ticks */}
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
                <React.Fragment key={tickValue}>
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
                </React.Fragment>
              );
            })}

            {/* Measurement data line */}
            <Line
              points={points.value}
              color={CHART_COLORS.line}
              strokeWidth={2}
            />

            {/* Dots at each measurement point */}
            <Scatter
              points={points.value}
              color={CHART_COLORS.line}
              radius={3}
            />

            {/* Interactive crosshair */}
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

      {/* Y-axis labels and binding labels
          CartesianChart clips its Skia children to chartBounds, so labels that
          must appear in the left/right padding areas are rendered here as React
          Native Text views positioned absolutely over the canvas. */}
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
            <React.Fragment key={tickValue}>
              {/* Numeric label — right-aligned within the left padding area */}
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

              {/* Binding label — left-aligned in the right padding area */}
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
            </React.Fragment>
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

export default ChartComponent;
