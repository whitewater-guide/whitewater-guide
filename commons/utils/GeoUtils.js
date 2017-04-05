import _ from 'lodash';
import DmsCoordinates from 'dms-conversion';

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

export function arrayToPrettyDMS([lon, lat]) {
  const { latitude, longitude } = new DmsCoordinates(lat, lon).getDmsArrays();
  if (latitude[2]) {
    latitude[2] = Math.round(latitude[2]);
  }
  if (longitude[2]) {
    longitude[2] = Math.round(longitude[2]);
  }
  return `${latitude[0]}°${latitude[1]}′${latitude[2]}″ ${latitude[3]}, ${longitude[0]}°${longitude[1]}′${longitude[2]}″ ${longitude[3]}`;
}
