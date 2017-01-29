import _ from 'lodash';

export function gmapsToArray(latLng){
  if (!latLng)
    return null;
  let {lat, lng} = latLng;
  if (_.isFunction(lat))
    lat = lat();
  if (_.isFunction(lng))
    lng = lng();
  return [lng, lat];
}

export function arrayToGmaps(array){
  if (!array)
    return null;
  const [lng, lat] = array;
  return {lat, lng}
}

export function isValidLat(lat){
  return _.isNumber(lat) && lat >= -90 && lat <= 90;
}

export function isValidLng(lng){
  return _.isNumber(lng) && lng >= -180 && lng <= 180;
}