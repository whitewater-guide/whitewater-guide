import { useMemo } from 'react';

import { ChartDataPoint } from '../types';
import { DomainMeta } from './types';

function useZoomedData(
  data: ChartDataPoint[],
  zoomedDomain: DomainMeta['domain'],
  width: number,
  maxDensity = 16,
): ChartDataPoint[] {
  return useMemo(() => {
    const { x: zoomedXDomain } = zoomedDomain;
    const maxPoints = width / maxDensity;

    const startIndex = data.findIndex((d) => d.timestamp >= zoomedXDomain[0]);
    const endIndex = data.findIndex((d) => d.timestamp > zoomedXDomain[1]);
    let filtered = data.slice(
      Math.max(startIndex - 1, 0),
      endIndex === -1 ? -1 : endIndex + 1,
    );
    // const filtered = data.slice(startIndex, endIndex);

    if (filtered.length > maxPoints) {
      // limit k to powers of 2, e.g. 64, 128, 256
      // so that the same points will be chosen reliably, reducing flicker
      const k = Math.pow(2, Math.ceil(Math.log2(filtered.length / maxPoints)));
      filtered = filtered.filter(
        // ensure modulo is always calculated from same reference: i + startIndex
        (_, i) => (i + startIndex) % k === 0,
      );

      // Ensure that latest point always is preset
      const latest = endIndex === -1 ? data[data.length - 1] : data[endIndex];
      if (
        filtered[filtered.length - 1].timestamp.getTime() !==
        latest.timestamp.getTime()
      ) {
        filtered.push(latest);
      }
    }
    return filtered;
  }, [data, zoomedDomain, width, maxDensity]);
}

export default useZoomedData;
