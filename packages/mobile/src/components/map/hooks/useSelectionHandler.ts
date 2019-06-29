import { ShapeSourcePressEvent } from '@react-native-mapbox-gl/maps';
import area from '@turf/area';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { Feature } from '@turf/helpers';
import square from '@turf/square';
import { BBox, useMapSelection } from '@whitewater-guide/clients';
import { isSection, Point, Section } from '@whitewater-guide/commons';
import { MutableRefObject, useCallback } from 'react';
import { NativeSyntheticEvent } from 'react-native';
import theme from '../../../theme';
import isNativeSyntheticEvent from '../../../utils/isNativeSyntheticEvent';
import { useCamera } from './useCamera';

const getSectionMiddle = (section: Section): [number, number] => {
  const [pLng, pLat] = section.putIn.coordinates;
  const [tLng, tLat] = section.takeOut.coordinates;
  return [(pLng + tLng) / 2, (pLat + tLat) / 2];
};

export const useSelectionHandler = (
  sections: Section[],
  pois: Point[],
  sectionSelectable = true,
  visibleBounds: MutableRefObject<BBox>,
) => {
  const { onSelected } = useMapSelection();
  const camera = useCamera();
  const onPress = useCallback(
    (e: Feature | NativeSyntheticEvent<ShapeSourcePressEvent<{}>>) => {
      if (!isNativeSyntheticEvent(e)) {
        onSelected(null);
        return;
      }
      const {
        nativeEvent: { payload },
      } = e;
      const {
        geometry: { type },
        id,
      } = payload;
      const nodes: Array<Section | Point> =
        type === 'LineString' ? sections : pois;
      const node = nodes.find((el) => el.id === id);
      if (node) {
        if (isSection(node) && !sectionSelectable) {
          e.preventDefault();
          return;
        }
        onSelected(node);
        if (camera) {
          if (isSection(node)) {
            const [[maxLng, maxLat], [minLng, minLat]] = visibleBounds.current;
            const boundsArea = area(
              bboxPolygon([minLng, minLat, maxLng, maxLat]),
            );
            const squared = square(bbox(payload.geometry));
            const sectionArea = area(bboxPolygon(squared));
            if (sectionArea < boundsArea) {
              camera.moveTo(getSectionMiddle(node), 300);
            } else {
              camera.fitBounds(
                [squared[2], squared[3]],
                [squared[0], squared[1]],
                theme.margin.single,
                2600,
              );
            }
          } else {
            camera.moveTo(node.coordinates, 300);
          }
        }
      }
    },
    [onSelected, sections, pois, camera, sectionSelectable],
  );
  return onPress;
};
