import _ from 'lodash';
import { BoundingBox } from 'geocoordinate';

export function gmapsToArray(latLng) {
  if (!latLng) {
    return null;
  }
  let { lat, lng } = latLng;
  if (_.isFunction(lat)) {
    lat = lat();
  }
  if (_.isFunction(lng)) {
    lng = lng();
  }
  return [lng, lat];
}

export function arrayToGmaps(array) {
  if (!array) {
    return null;
  }
  const [lng, lat] = array;
  return { lat, lng };
}

export function isValidLat(lat) {
  return _.isNumber(lat) && lat >= -90 && lat <= 90;
}

export function isValidLng(lng) {
  return _.isNumber(lng) && lng >= -180 && lng <= 180;
}

export function arrayToDMSString(coordinates, pretty = true) {
  const truncate = n => (n > 0 ? Math.floor(n) : Math.ceil(n));
  const latHemisphere = coordinates[1] < 0 ? 'S' : 'N';
  const lonHemisphere = coordinates[0] < 0 ? 'W' : 'E';
  const hemispheres = [lonHemisphere, latHemisphere];
  return coordinates.map((dd, i) => {
    const absDD = Math.abs(dd);
    const degrees = truncate(absDD);
    const minutes = truncate((absDD - degrees) * 60);
    let seconds = (absDD - degrees - (minutes / 60)) * 3600;
    if (pretty) {
      seconds = truncate(seconds);
    }
    return `${degrees}°${minutes}′${seconds}″ ${hemispheres[i]}`;
  }).reverse().join(', ');
}

/**
 * Compute distance between two points in kms using https://en.wikipedia.org/wiki/Haversine_formula
 * @param a Point in [lng, lat] format
 * @param b Point in [lng, lat] format
 * @returns Distance in km
 */
export function computeDistanceBetween(a, b) {
  const [aLng, aLat] = a.map(coord => coord * Math.PI / 180);
  const [bLng, bLat] = b.map(coord => coord * Math.PI / 180);
  const dLat2 = (aLat - bLat) / 2;
  const dLng2 = (aLng - bLng) / 2;
  const hav = Math.pow(Math.sin(dLat2), 2) + Math.cos(aLat) * Math.cos(bLat) * (Math.pow(Math.sin(dLng2), 2));
  return 2 * 6378.137 * Math.asin(
    Math.sqrt(hav),
  );
}

function latRad(lat) {
  const sin = Math.sin(lat * Math.PI / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function zoom(mapPx, worldPx, fraction) {
  return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
}

/**
 * Computes google map zoom level, given bounds and map size
 * http://stackoverflow.com/a/13274361/6212547
 * @param bounds - array of [lng, lat] arrays
 * @param mapDim {width, height} of map in pixels
 * @returns {number} Integer zoom level
 */
export function getBoundsZoomLevel(bounds = [], mapDim) {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  const bbox = new BoundingBox();
  bounds.forEach(point => bbox.pushCoordinate(point[1], point[0]));

  const latFraction = (latRad(bbox.latitude.max) - latRad(bbox.latitude.min)) / Math.PI;

  const lngDiff = bbox.longitude.max - bbox.longitude.min;
  const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

  const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

/**
 * Compares 2 arrays of [lng, lat] pairs and return patch in `immutability-helper` $splice format
 * @param prev Old value
 * @param next New value
 * @returns {*}
 */
export function getCoordinatesPatch(prev, next) {
  const delta = next.length - prev.length;
  const delCount = delta > 0 ? 0 : 1;
  const min = Math.min(prev.length, next.length);
  for (let i = 0; i < min; i += 1) {
    if (prev[i][0] !== next[i][0] || prev[i][1] !== next[i][1]) {
      const patch = [i, delCount];
      if (delta >= 0) {
        patch.push([next[i][0], next[i][1]]);
      }
      return patch;
    }
  }
  if (delta > 0) { // Insert in the end
    return [prev.length, 0, next[next.length - 1]];
  } else if (delta < 0) { // Delete the last
    return [next.length, 1];
  }
  return null;
}
