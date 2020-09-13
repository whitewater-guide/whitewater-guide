import { CoordinateLoose } from '@whitewater-guide/commons';

import { getBBox } from './getBBox';

function zoom(mapPx: number, worldPx: number, fraction: number) {
  return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
}

function latRad(lat: number) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

/**
 * Computes google map zoom level, given bounds and map size
 * http://stackoverflow.com/a/13274361/6212547
 * @param bounds - array of [lng, lat] arrays
 * @param mapDim {width, height} of map in pixels
 * @returns {number} Integer zoom level
 */
export function getBoundsZoomLevel(
  bounds: CoordinateLoose[] = [],
  mapDim: { width: number; height: number },
) {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  const [minLng, maxLng, minLat, maxLat] = getBBox(bounds, true);

  const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;

  const lngDiff = maxLng - minLng;
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}
