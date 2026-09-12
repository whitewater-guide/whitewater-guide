import type { PointCoreFragment } from '@whitewater-guide/schema';
import { useMemo } from 'react';

import type { MapSection } from '../types';

import { arrowAzimuth } from '@/utils/geo';

const SECTION_COLOR = '#666666';

export interface GeoJsonLineProps {
  color: string;
  approximate: boolean;
  arrowAzimuth: number;
  name?: string;
}

export interface GeoJsonPointProps {
  kind: string;
}

export interface MapboxData {
  sections: GeoJSON.FeatureCollection<GeoJSON.LineString, GeoJsonLineProps>;
  pois: GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonPointProps>;
  arrows: GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonLineProps>;
}

function removeAlt([lng, lat]: number[]): [number, number] {
  return [lng, lat];
}

function sectionName(section: MapSection): string {
  const riverName = section.river?.name ?? '';
  return [riverName, section.name].filter((s) => !!s).join(' - ');
}

function sectionToGeoJSON(
  section: MapSection,
  detailed?: boolean,
): GeoJSON.Feature<GeoJSON.LineString, GeoJsonLineProps> {
  const { id, shape, putIn, takeOut } = section;
  const coordinates =
    detailed && shape && shape.length > 1
      ? shape.map(removeAlt)
      : [removeAlt(putIn.coordinates), removeAlt(takeOut.coordinates)];
  const azimuth = arrowAzimuth(
    coordinates[coordinates.length - 2],
    coordinates[coordinates.length - 1],
  );

  return {
    id,
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {
      color: SECTION_COLOR,
      approximate: !!section.approximate,
      arrowAzimuth: azimuth,
      name: sectionName(section),
    },
  };
}

function poiToGeoJSON(
  poi: PointCoreFragment,
): GeoJSON.Feature<GeoJSON.Point, GeoJsonPointProps> {
  return {
    id: poi.id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [poi.coordinates[0], poi.coordinates[1]],
    },
    properties: {
      kind: poi.kind,
    },
  };
}

function sectionToArrowPoint(
  section: GeoJSON.Feature<GeoJSON.LineString, GeoJsonLineProps>,
): GeoJSON.Feature<GeoJSON.Point, GeoJsonLineProps> {
  const takeOut =
    section.geometry.coordinates[section.geometry.coordinates.length - 1];
  return {
    type: 'Feature',
    geometry: {
      coordinates: [...takeOut],
      type: 'Point',
    },
    id: section.id,
    properties: { ...section.properties },
  };
}

export const useMapboxData = (
  sections: MapSection[],
  pois?: PointCoreFragment[],
  detailed?: boolean,
): MapboxData =>
  useMemo(() => {
    const sectionsJSON: MapboxData['sections'] = {
      type: 'FeatureCollection',
      features: sections.map((s) => sectionToGeoJSON(s, detailed)),
    };
    const arrows = sectionsJSON.features.map(sectionToArrowPoint);
    return {
      sections: sectionsJSON,
      pois: {
        type: 'FeatureCollection',
        features: (pois ?? []).map(poiToGeoJSON),
      },
      arrows: { type: 'FeatureCollection', features: arrows },
    };
  }, [sections, pois, detailed]);
