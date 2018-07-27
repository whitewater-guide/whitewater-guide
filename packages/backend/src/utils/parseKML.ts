import { Coordinate3d } from '@ww-commons';
import { readFileSync } from 'fs';
import { Feature, FeatureCollection, LineString } from 'geojson';
import compact from 'lodash/compact';
import orderBy from 'lodash/orderBy';
import { kml } from 'togeojson';
import { DOMParser } from 'xmldom';

const COLOR_TO_DIFFICULTY = new Map<string, number>([
  ['#4186f0', 2],
  ['#009d57', 3],
  ['#ffdd5e', 4],
  ['#f4eb37', 4],
  ['#db4436', 5],
  ['#000000', 6],
]);

interface FeatureProps {
  name: string;
  description: string;
  stroke: string;
}

export interface KMLSection {
  river: string;
  hasGauge: boolean;
  name: string;
  description: string | null;
  difficulty: number;
  difficultyExtra: string | null;
  coordinates: Coordinate3d[];
}

export const parseKML = (file: string): KMLSection[] => {
  const kmlDoc = new DOMParser().parseFromString(readFileSync(file, 'utf8'));
  const features: FeatureCollection<LineString, FeatureProps> = kml(kmlDoc);
  return orderBy(compact(features.features.map(parseFeature)), 'river');
};

const parseFeature = (feature: Feature<LineString, FeatureProps>): KMLSection | null => {
  let fullname = feature.properties.name;
  if (!fullname.includes(':')) {
    return null;
  }
  // this means bad coordinates
  if (feature.properties.stroke === '#ffffff' || !COLOR_TO_DIFFICULTY.has(feature.properties.stroke)) {
    return null;
  }
  fullname = fullname.trim();
  const hasGauge = fullname.startsWith('*');
  if (hasGauge) {
    fullname = fullname.substr(1).trim();
  }
  const [river, name] = fullname.split(':').map((s) => s.trim());
  const [difficultyExtra, description = null] = feature.properties.description.split('<br>');
  return {
    river,
    name,
    hasGauge,
    coordinates: feature.geometry.coordinates as any,
    difficulty: COLOR_TO_DIFFICULTY.get(feature.properties.stroke)!,
    difficultyExtra,
    description,
  };
};
