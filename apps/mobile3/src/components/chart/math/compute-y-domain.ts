import type { Unit } from '@whitewater-guide/schema';

import type { ChartDataPoint, GaugeBindingValues } from '../types';

const Y_TICKS = 5;
const Y_DELTA_RATIO = 0.08;
const D3_NICE_COUNT = 10;

function niceStep(raw: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  return n <= 2 ? 2 * mag : n <= 5 ? 5 * mag : 10 * mag;
}

function tickIncrement(start: number, stop: number, count: number): number {
  const step = (stop - start) / count;
  const power = Math.floor(Math.log10(step));
  const error = step / Math.pow(10, power);
  const factor =
    error >= Math.sqrt(50)
      ? 10
      : error >= Math.sqrt(10)
        ? 5
        : error >= Math.sqrt(2)
          ? 2
          : 1;
  return factor * Math.pow(10, power);
}

function niceDomain(min: number, max: number): [number, number] {
  if (min === max || !isFinite(max - min) || max - min <= 0) return [min, max];
  const step = tickIncrement(min, max, D3_NICE_COUNT);
  return [Math.floor(min / step) * step, Math.ceil(max / step) * step];
}

export interface YDomainResult {
  yDomain: [number, number];
  yTickValues: number[];
}

export function computeYDomain(
  data: ChartDataPoint[],
  unit: Unit,
  binding: GaugeBindingValues | null | undefined,
): YDomainResult {
  const unitKey = unit as 'flow' | 'level';
  const values = data
    .map((d) => d[unitKey])
    .filter((v): v is number => v != null);

  let yMin = values.length ? Math.min(...values) : 0;
  let yMax = values.length ? Math.max(...values) : 10;

  const bindingTicks: number[] = [];
  if (binding) {
    const { minimum, maximum, optimum, impossible } = binding;
    const bv = [minimum, maximum, optimum, impossible].filter(
      (v): v is number => v != null,
    );
    if (bv.length) {
      yMin = Math.min(yMin, ...bv);
      yMax = Math.max(yMax, ...bv);
      bindingTicks.push(...bv);
    }
  }

  const delta = (yMax - yMin) * Y_DELTA_RATIO;
  const paddedMin = yMin - delta;
  const paddedMax = yMax === yMin ? yMin + 10 : yMax + delta;

  const [niceMin, niceMax] = niceDomain(paddedMin, paddedMax);

  const step = niceStep((niceMax - niceMin) / Y_TICKS);
  const first = Math.ceil(niceMin / step) * step;
  const linearTicks: number[] = [];
  for (let v = first; v <= niceMax; v += step) {
    linearTicks.push(v);
  }

  const minSpacing = step * 0.35;
  const filteredLinearTicks =
    bindingTicks.length > 0
      ? linearTicks.filter((lt) =>
          bindingTicks.every((bt) => Math.abs(lt - bt) >= minSpacing),
        )
      : linearTicks;

  const allTicks = [...new Set([...bindingTicks, ...filteredLinearTicks])].sort(
    (a, b) => a - b,
  );

  const gapThreshold = (niceMax - niceMin) / Y_TICKS;
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

  return { yDomain: [niceMin, niceMax], yTickValues: finalTicks };
}
