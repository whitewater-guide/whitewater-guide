interface LatLngLiteral {
  lat: number;
  lng: number;
}

/**
 * Converts our coordinate to google maps format
 * @param array
 */
export function arrayToGmaps(array?: null): null;
export function arrayToGmaps(array: CodegenCoordinates): LatLngLiteral;
export function arrayToGmaps(
  array?: CodegenCoordinates | null,
): LatLngLiteral | null {
  if (!array) {
    return null;
  }
  const [lng, lat] = array;
  return { lat, lng };
}
