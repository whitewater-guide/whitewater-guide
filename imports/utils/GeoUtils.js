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