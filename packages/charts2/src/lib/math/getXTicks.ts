import { Skia } from '@shopify/react-native-skia';
import { format } from 'date-fns';

import type { ChartDataDimensions, XTicks } from './types';

const granularities = [
  { label: 'HH:mm', step: 30 * 60 * 1000 }, // 30 min
  { label: 'HH:mm', step: 1 * 60 * 60 * 1000 }, // 1h
  { label: 'HH:mm', step: 3 * 60 * 60 * 1000 }, // 3h
  { label: 'HH:mm', step: 12 * 60 * 60 * 1000 }, // 12h
  { label: 'dd MMM', step: 24 * 60 * 60 * 1000 }, // 24h
];

export function getXTicks(data: ChartDataDimensions): XTicks[] {
  // TODO: this can be determined based on x-tcik label width and chartWidth
  // const chartWidth = scaleX(data.maxTs) - scaleX(data.minTs); // Initial chart width in pixels
  const [minTicks, maxTicks] = [5, 15];

  const { scaleX, scaleY, minVal, maxVal } = data;
  const minY = scaleY(minVal) + data.padding.top;
  const maxY = scaleY(maxVal) - data.padding.bottom;
  const range = data.maxTs - data.minTs; // Initial chart width in milliseconds

  // const pixelsPerMs = zoom * chartWidth / range;
  // pixelsPerMs * step * numTicks = chartWidth
  // zoom * chartWidth * dur * numTicks / range = chartWidth
  // zoom * step * numTicks / range = 1
  // zoom = range / (step * numTicks)

  const result = granularities.map((g): XTicks => {
    return {
      minZoom: Math.max(1, range / (g.step * maxTicks)),
      maxZoom: range / (g.step * minTicks),
      ticks: [],
      gridLines: Skia.Path.Make(),
    };
  });
  // let xGrid = Skia.Path.Make();
  //     ticks.forEach(({ x }) => {
  //
  //     });

  const minStep = granularities[0].step;
  const minTs = Math.floor(data.minTs / minStep) * minStep;
  const maxTs = Math.ceil(data.maxTs / minStep) * minStep;

  // console.log(new Date(data.minTs), '-->', new Date(minTs));
  // console.log(new Date(data.maxTs), '-->', new Date(maxTs));

  for (let ts = minTs; ts <= maxTs; ts += minStep) {
    const x = scaleX(ts);
    for (let i = 0; i < granularities.length; i++) {
      const g = granularities[i];
      if (ts % g.step === 0) {
        // TODO: format in timezone
        result[i].ticks.push({
          label: format(ts, g.label),
          timestamp: ts,
          x,
        });
        result[i].gridLines.moveTo(x, minY).lineTo(x, maxY);
      }
    }
  }
  result[0].maxZoom = Number.POSITIVE_INFINITY;
  result[result.length - 1].minZoom = 1;

  return result.filter((t) => t.ticks.length > 2);
}
