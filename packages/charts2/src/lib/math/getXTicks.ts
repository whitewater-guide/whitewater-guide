import type { ChartData } from './dataToCanvas';

export interface XTick {
  timestamp: number;
  x: number;
  label: string;
}

export interface XTicks {
  minZoom: number;
  maxZoom: number;
  ticks: XTick[];
}

const granularities = [
  { label: '24h', duration: 24 * 60 * 60 * 1000 },
  { label: '12h', duration: 12 * 60 * 60 * 1000 },
  { label: '3h', duration: 3 * 60 * 60 * 1000 },
  { label: '1h', duration: 1 * 60 * 60 * 1000 },
  { label: '30min', duration: 30 * 60 * 1000 },
];

export function getXTicks(data: ChartData): XTicks[] {
  const { minTs, maxTs, scaleX } = data;
  const chartWidth = scaleX(maxTs) - scaleX(minTs); // Initial chart width in pixels
  const range = maxTs - minTs;

  // Desired range for the number of ticks to maintain readability
  const minTicks = 5;
  const maxTicks = 15;

  let previousMaxZoom = 0; // Initialize with 0 to ensure the first granularity's minZoom is always > 0

  const xTicks: XTicks[] = granularities
    .map((granularity) => {
      // Calculate the chart width at which this granularity would have minTicks and maxTicks
      const minWidthForGranularity =
        minTicks * granularity.duration * (chartWidth / range);
      const maxWidthForGranularity =
        maxTicks * granularity.duration * (chartWidth / range);

      // Adjust minZoom based on the previous granularity's maxZoom to avoid overlap
      const minZoom = Math.max(
        minWidthForGranularity / chartWidth,
        previousMaxZoom + 0.01,
      ); // Ensure non-overlapping by adding a small increment
      const maxZoom = maxWidthForGranularity / chartWidth;

      // Update previousMaxZoom for the next iteration
      previousMaxZoom = maxZoom;

      const ticks: XTick[] = [];
      let currentTs = minTs - (minTs % granularity.duration);
      while (currentTs <= maxTs) {
        if (currentTs >= minTs && currentTs <= maxTs) {
          const x = scaleX(currentTs);
          const label = new Date(currentTs).toISOString();
          ticks.push({ timestamp: currentTs, x, label });
        }
        currentTs += granularity.duration;
      }

      return { minZoom, maxZoom, ticks };
    })
    .filter((granularity) => granularity.ticks.length > 0);

  return xTicks;
}
