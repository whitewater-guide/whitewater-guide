export type DrawingMode = 'LineString' | 'Polygon' | 'Point';

// These props are passed to each child of GoogleMap
export interface MapElement {
  map: google.maps.Map;
  zoom: number;
  bounds: google.maps.LatLngBounds | null;
}
