export function arrayToLatLngString(coord?: CodegenCoordinates): string {
  if (!coord) {
    return '';
  }
  const [lng, lat] = coord;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
