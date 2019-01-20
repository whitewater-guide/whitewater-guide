type LatLng = google.maps.LatLng;
type Geometry = google.maps.Data.Geometry;
type Point = google.maps.Data.Point;
type LineString = google.maps.Data.LineString;
type Polygon = google.maps.Data.Polygon;

export function isPoint(geometry: Geometry): geometry is Point {
  return geometry.getType() === 'Point';
}

export function isLineString(geometry: Geometry): geometry is LineString {
  return geometry.getType() === 'LineString';
}

export function isPolygon(geometry: Geometry): geometry is Polygon {
  return geometry.getType() === 'Polygon';
}

export function geometryToLatLngs(geometry?: Geometry): LatLng[] | null {
  if (!geometry) {
    return null;
  }
  if (isPoint(geometry)) {
    return [geometry.get()];
  } else if (isLineString(geometry)) {
    return geometry.getArray();
  } else if (isPolygon(geometry)) {
    return geometry.getAt(0).getArray();
  }
  return null;
}
