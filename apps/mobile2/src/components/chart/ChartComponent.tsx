import { matchFont } from '@shopify/react-native-skia';
import type { ChartViewProps } from '@whitewater-guide/clients';
import { getColorForValue } from '@whitewater-guide/clients';
import type {
  GaugeBinding,
  MeasurementsFilter,
} from '@whitewater-guide/schema';
import { Unit } from '@whitewater-guide/schema';
import addDays from 'date-fns/addDays';
import differenceInDays from 'date-fns/differenceInDays';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';
import compact from 'lodash/compact';
import React, { useCallback, useMemo } from 'react';
import { Platform, View } from 'react-native';
import { CartesianChart, Line, useChartPressState } from 'victory-native';

import { Crosshair } from './Crosshair';
import { HorizontalGrid } from './HorizontalGrid';
import { HorizontalLabel } from './HorizontalLabel';
import { HorizontalTick } from './HorizontalTick';
import { TimeGrid } from './TimeGrid';
import { formatTimeLabel } from './TimeLabel';
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

// ─── Domain helpers ──────────────────────────────────────────────────────────

const Y_TICKS = 5;
const Y_DELTA_RATIO = 0.08; // 8% padding above/below data range

function computeYDomain(
  data: ChartViewProps['data'],
  unit: Unit,
  binding: GaugeBinding | null | undefined,
): { yDomain: [number, number]; yTickValues: number[] } {
  const unitKey = unit as 'flow' | 'level';
  const values = data
    .map((d) => d[unitKey])
    .filter((v): v is number => v != null);

  let yMin = values.length ? Math.min(...values) : 0;
  let yMax = values.length ? Math.max(...values) : 10;

  const bindingTicks: number[] = [];
  if (binding) {
    const { minimum, maximum, optimum, impossible } = binding;
    const bv = compact([minimum, maximum, optimum, impossible]);
    if (bv.length) {
      yMin = Math.min(yMin, ...bv);
      yMax = Math.max(yMax, ...bv);
      bindingTicks.push(...bv);
    }
  }

  const delta = (yMax - yMin) * Y_DELTA_RATIO;
  const paddedMin = yMin - delta;
  const paddedMax = yMax === yMin ? yMin + 10 : yMax + delta;

  // Linear ticks
  const step = (paddedMax - paddedMin) / Y_TICKS;
  const linearTicks = Array.from(
    { length: Y_TICKS + 1 },
    (_, i) => paddedMin + i * step,
  );

  // Merge binding ticks + linear ticks, deduplicate, sort
  const allTicks = [...new Set([...bindingTicks, ...linearTicks])].sort(
    (a, b) => a - b,
  );

  return { yDomain: [paddedMin, paddedMax], yTickValues: allTicks };
}

function computeXDomain(filter: MeasurementsFilter): {
  xDomain: [number, number];
  days: number;
} {
  const now = new Date();
  const toDate = filter.to ? new Date(filter.to) : now;
  const fromDate = filter.from ? new Date(filter.from) : subDays(toDate, 1);
  const days = Math.max(1, differenceInDays(toDate, fromDate));
  return { xDomain: [fromDate.getTime(), toDate.getTime()], days };
}

function computeDaySeparators(
  xDomain: [number, number],
): Array<{ date: Date; ts: number }> {
  const [fromMs, toMs] = xDomain;
  const result: Array<{ date: Date; ts: number }> = [];
  // Start at beginning of the first full day after fromMs
  let current = startOfDay(addDays(new Date(fromMs), 1));
  while (current.getTime() < toMs) {
    result.push({ date: new Date(current), ts: current.getTime() });
    current = addDays(current, 1);
  }
  return result;
}

// ─── Pixel-space helpers ─────────────────────────────────────────────────────

function makeLinearScale(
  dataDomain: [number, number],
  pixelRange: [number, number],
) {
  const [d0, d1] = dataDomain;
  const [p0, p1] = pixelRange;
  return (value: number) =>
    d1 === d0 ? p0 : p0 + ((value - d0) / (d1 - d0)) * (p1 - p0);
}

// ─── Chart data point type ───────────────────────────────────────────────────

// Must satisfy Record<string, unknown> for CartesianChart generics
type VChartPoint = { ts: number; value: number } & Record<string, unknown>;

// ─── Props ───────────────────────────────────────────────────────────────────

type Props = ChartViewProps;

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Core chart component for the v41 (Skia-based) victory-native API.
 *
 * Renders a `CartesianChart` with:
 * - Time x-axis with day-separator lines and adaptive labels (TimeGrid/TimeLabel)
 * - Y-axis with binding-coloured grid lines and labels (HorizontalGrid/Tick/Label)
 * - Measurement data as a `Line` series
 * - Interactive crosshair on touch (Crosshair + useChartPressState)
 */
function ChartComponent({
  data,
  unit,
  gauge,
  section,
  filter,
  width,
  height,
}: Props) {
  const font = useMemo(() => matchFont(SKIA_FONT_STYLE), []);

  const binding =
    section && (unit === Unit.LEVEL ? section.levels : section.flows);

  const { yDomain, yTickValues } = useMemo(
    () => computeYDomain(data, unit, binding),
    [data, unit, binding],
  );

  const { xDomain, days } = useMemo(() => computeXDomain(filter), [filter]);

  const rawSeparators = useMemo(() => computeDaySeparators(xDomain), [xDomain]);

  // Transform ChartDataPoint[] → CartesianChart-compatible numeric records
  const chartData = useMemo<VChartPoint[]>(() => {
    const unitKey = unit as 'flow' | 'level';
    return data
      .filter((d) => d[unitKey] != null)
      .map((d) => ({ ts: d.timestamp.getTime(), value: d[unitKey] as number }));
  }, [data, unit]);

  const { state: pressState, isActive } = useChartPressState({
    x: 0,
    y: { value: 0 },
  });

  const formatX = useCallback(
    (ts: number) => formatTimeLabel(ts, days),
    [days],
  );

  return (
    <View style={{ width, height }}>
      <CartesianChart<VChartPoint, 'ts', 'value'>
        data={chartData}
        xKey="ts"
        yKeys={['value']}
        domain={{ x: xDomain, y: yDomain }}
        xAxis={{
          font,
          formatXLabel: formatX,
          labelColor: CHART_COLORS.label,
          lineColor: CHART_COLORS.axisLine,
          lineWidth: 1,
          tickCount: Math.min(days <= 1 ? 4 : days <= 3 ? 6 : 7, 10),
        }}
        yAxis={[
          {
            yKeys: ['value'],
            // Custom labels are drawn manually; disable built-in to avoid overlap
            font: null,
            tickValues: yTickValues,
            lineWidth: 0,
          },
        ]}
        chartPressState={pressState}
        padding={{ top: 20, bottom: 30, left: 52, right: 10 }}
      >
        {({ points, chartBounds }) => {
          // Pixel-space scale functions derived from domain + chartBounds
          const tsToX = makeLinearScale(xDomain, [
            chartBounds.left,
            chartBounds.right,
          ]);
          const valueToY = makeLinearScale(
            [yDomain[1], yDomain[0]], // inverted: larger value → smaller y pixel
            [chartBounds.top, chartBounds.bottom],
          );

          // Day-separator x pixel positions
          const separators = rawSeparators.map(({ date, ts }) => ({
            date,
            xPixel: tsToX(ts),
          }));

          return (
            <>
              {/* Day-separator vertical lines */}
              <TimeGrid
                separators={separators}
                chartBounds={chartBounds}
                days={days}
              />

              {/* Binding-coloured horizontal grid lines, ticks, and labels */}
              {yTickValues.map((tickValue) => {
                const yPx = valueToY(tickValue);
                const color = getColorForValue(
                  tickValue,
                  binding,
                  CHART_COLORS.gridLine,
                );
                const label =
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
                    <HorizontalGrid
                      y={yPx}
                      color={color}
                      label={label}
                      chartBounds={chartBounds}
                      font={font}
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
                    <HorizontalLabel
                      y={yPx}
                      value={tickValue}
                      color={
                        color === CHART_COLORS.gridLine
                          ? CHART_COLORS.label
                          : color
                      }
                      chartBounds={chartBounds}
                      font={font}
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
          );
        }}
      </CartesianChart>
    </View>
  );
}

export default ChartComponent;
