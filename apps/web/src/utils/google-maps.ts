import round from 'lodash/round';

type LatLngLiteral = google.maps.LatLngLiteral;
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

export const latLngToPrecision = (
  value: LatLng | LatLngLiteral,
  precision = 4,
): LatLngLiteral => {
  const lat = round(
    typeof value.lat === 'number' ? value.lat : value.lat(),
    precision,
  );
  const lng = round(
    typeof value.lng === 'number' ? value.lng : value.lng(),
    precision,
  );
  return { lat, lng };
};

export function geometryToLatLngs(
  geometry?: Geometry,
  precision?: number,
): Array<LatLng | LatLngLiteral> | null {
  if (!geometry) {
    return null;
  }
  if (isPoint(geometry)) {
    return [latLngToPrecision(geometry.get(), precision)];
  }
  if (isLineString(geometry)) {
    return geometry.getArray().map((pt) => latLngToPrecision(pt, precision));
  }
  if (isPolygon(geometry)) {
    return geometry
      .getAt(0)
      .getArray()
      .map((pt) => latLngToPrecision(pt, precision));
  }
  return null;
}
