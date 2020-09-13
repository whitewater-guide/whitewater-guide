import { Coordinate3d, parseDifficultyString } from '@whitewater-guide/commons';
import { readFileSync } from 'fs';
import { Feature, FeatureCollection, LineString } from 'geojson';
import compact from 'lodash/compact';
import orderBy from 'lodash/orderBy';
import { kml } from 'togeojson';
import Turndown from 'turndown';
import { DOMParser } from 'xmldom';

import { FeatureProps, KMLSection } from './types';

const NAME_REGEX = /^(?<river>[^([]*)(\((?<section>[^([]*)\))?\s*(\[(?<diff>[^(]*)\s*(\((?<xtra>.*)\))?])?$/;
const WATERFALL = '#icon-24';
const PLAYSPOT = '#icon-62';
const REGION_POI = '#icon-69';

const expandPoint = (coordinates: any): Coordinate3d[] =>
  Array.isArray(coordinates[0]) ? coordinates : [coordinates, coordinates];

export const parseKML = (file: string): KMLSection[] => {
  const kmlDoc = new DOMParser().parseFromString(readFileSync(file, 'utf8'));
  const features: FeatureCollection<LineString, FeatureProps> = kml(kmlDoc);
  const turndown = new Turndown();
  const result = orderBy(
    compact(
      features.features.map((feature) => parseFeature(feature, turndown)),
    ),
    'river',
  );
  return result;
};

const parseFeature = (
  feature: Feature<any, FeatureProps>,
  turndown: Turndown,
): KMLSection | null => {
  const { name, description, styleUrl } = feature.properties;
  if (styleUrl === REGION_POI) {
    return null;
  }
  const match = NAME_REGEX.exec(name);
  const { river, section, diff, xtra } = (match ? match.groups : {}) as any;
  const defaultDiff =
    styleUrl === WATERFALL ? 5 : styleUrl === PLAYSPOT ? 2.5 : 1;
  return {
    coordinates: expandPoint(feature.geometry.coordinates),
    description: description ? turndown.turndown(description) : null,
    river: river.trim(),
    name: section ? section.trim() : 'Main',
    difficulty: diff ? parseDifficultyString(diff.trim()) : defaultDiff,
    difficultyXtra: xtra || null,
  };
};
