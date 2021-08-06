import { Point, Polygon } from 'wkx';

import { Coordinates } from '~/apollo';

export function getBounds(bounds: Coordinates[] | null) {
  let rawBounds = null;
  if (bounds && bounds.length > 0) {
    const polygon: Polygon = new Polygon(bounds.map((p) => new Point(...p)));
    // Close the ring
    polygon.exteriorRing.push(new Point(...bounds[0]));
    polygon.srid = 4326;
    rawBounds = polygon.toEwkt();
  }
  return rawBounds;
}
