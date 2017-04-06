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
