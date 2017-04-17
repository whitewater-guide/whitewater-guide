import _ from 'lodash';

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

export function arrayBoundsToLatLngBounds(bounds) {
  if (!bounds) {
    return null;
  }
  return {
    sw: { lat: bounds.sw[1], lng: bounds.sw[0] },
    ne: { lat: bounds.ne[1], lng: bounds.ne[0] },
  };
}

export function latLngBoundsToArrayBounds(latLng) {
  if (!latLng) {
    return null;
  }
  return {
    sw: [latLng.sw.lng, latLng.sw.lat],
    ne: [latLng.ne.lng, latLng.ne.lat],
  };
}

export function arrayBoundsToDeltaRegion(bounds) {
  if (!bounds) {
    return null;
  }
  return {
    latitude: (bounds.sw[1] + bounds.ne[1]) / 2,
    longitude: (bounds.sw[0] + bounds.ne[0]) / 2,
    latitudeDelta: (bounds.ne[1] - bounds.sw[1]) / 2,
    longitudeDelta: (bounds.ne[0] - bounds.sw[0]) / 2,
  };
}

export function deltaRegionToArrayBounds(region) {
  if (!region) {
    return null;
  }
  return {
    sw: [region.longitude - region.longitudeDelta, region.latitude - region.latitudeDelta],
    ne: [region.longitude + region.longitudeDelta, region.latitude + region.latitudeDelta],
  };
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
 * @param bounds in shape {sw: [lng, lat], ne: [lng, lat]}
 * @param mapDim {width, height} of map in pixels
 * @returns {number} Integer zoom level
 */
export function getBoundsZoomLevel(bounds, mapDim) {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  const { sw: [swLng, swLat], ne: [neLng, neLat] } = bounds;

  const latFraction = (latRad(neLat) - latRad(swLat)) / Math.PI;

  const lngDiff = neLng - swLng;
  const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

  const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}
