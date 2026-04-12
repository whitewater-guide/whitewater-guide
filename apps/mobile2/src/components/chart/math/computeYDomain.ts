import type { ChartViewProps } from '@whitewater-guide/clients';
import type { GaugeBinding } from '@whitewater-guide/schema';
import { Unit } from '@whitewater-guide/schema';
import compact from 'lodash/compact';

const Y_TICKS = 5;
const Y_DELTA_RATIO = 0.08; // 8% padding above/below data range

function niceStep(raw: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  return n <= 2 ? 2 * mag : n <= 5 ? 5 * mag : 10 * mag;
}

export function computeYDomain(
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

  // Linear ticks — use a nice (1/2/5 × 10ⁿ) step so labels are round numbers
  const step = niceStep((paddedMax - paddedMin) / Y_TICKS);
  const first = Math.ceil(paddedMin / step) * step;
  const linearTicks: number[] = [];
  for (let v = first; v <= paddedMax; v += step) {
    linearTicks.push(v);
  }

  // Drop linear ticks that are too close to a binding tick (would overlap labels)
  const minSpacing = step * 0.35;
  const filteredLinearTicks =
    bindingTicks.length > 0
      ? linearTicks.filter((lt) =>
          bindingTicks.every((bt) => Math.abs(lt - bt) >= minSpacing),
        )
      : linearTicks;

  // Merge binding ticks + filtered linear ticks, deduplicate, sort
  const allTicks = [...new Set([...bindingTicks, ...filteredLinearTicks])].sort(
    (a, b) => a - b,
  );

  // Fill large empty intervals with a single nice midpoint tick.
  // A gap qualifies if it exceeds the target tick spacing and has no tick inside.
  const gapThreshold = (paddedMax - paddedMin) / Y_TICKS;
  const fillTicks: number[] = [];
  for (let i = 0; i < allTicks.length - 1; i++) {
    const lo = allTicks[i];
    const hi = allTicks[i + 1];
    if (hi - lo > gapThreshold) {
      const mid = (lo + hi) / 2;
      const roundTo = Math.pow(10, Math.floor(Math.log10(hi - lo) - 1));
      fillTicks.push(Math.round(mid / roundTo) * roundTo);
    }
  }

  const finalTicks =
    fillTicks.length > 0
      ? [...new Set([...allTicks, ...fillTicks])].sort((a, b) => a - b)
      : allTicks;

  return { yDomain: [paddedMin, paddedMax], yTickValues: finalTicks };
}
