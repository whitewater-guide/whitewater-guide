import LatLng = google.maps.LatLng;
import Geometry = google.maps.Data.Geometry;
import Point = google.maps.Data.Point;
import LineString = google.maps.Data.LineString;
import Polygon = google.maps.Data.Polygon;

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
