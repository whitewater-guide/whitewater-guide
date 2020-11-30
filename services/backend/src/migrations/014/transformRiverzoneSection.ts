import {
  Coordinate3d,
  GaugeBinding,
  parseDifficultyString,
  SectionInput,
} from '@whitewater-guide/commons';
import { POITypesMap, RzSection } from './types';

export const transformRiverzoneSection = (
  value: RzSection,
  riverId: string,
): Omit<SectionInput, 'helpNeeded'> => {
  const unit = value.gauge.unit;
  // all riverzone gauges are in cm, but bindings are sometimes in m
  const k = unit === 'm' ? 100 : 1;
  const binding: GaugeBinding = {
    approximate: value.gauge.indirect,
    minimum: value.gauge.min && k * value.gauge.min,
    optimum: value.gauge.med && k * value.gauge.med,
    maximum: value.gauge.max && k * value.gauge.max,
  };
  const shape: Coordinate3d[] = [
    [value.putInLatLng![1] / 1000000, value.putInLatLng![0] / 1000000, 0],
    [
      (value.takeOutLatLng || value.putInLatLng)![1] / 1000000,
      (value.takeOutLatLng || value.putInLatLng)![0] / 1000000,
      0,
    ],
  ];
  const pois = value.pois
    .filter(({ type }) => !!POITypesMap.get(type))
    .map(({ type, notes, latlng }) => ({
      id: null,
      name: type,
      coordinates: [
        latlng![1] / 1000000,
        latlng![0] / 1000000,
        0,
      ] as Coordinate3d,
      kind: POITypesMap.get(type)!,
      description: JSON.stringify(notes) || type,
    }));
  return {
    id: null,
    name: `${value.sectionName} [RIVERZONE.EU]`,
    altNames: null,
    description: `URL: ${value.descriptionUrl}
    Category: ${value.category}
    News: ${JSON.stringify(value.news)}
    DurationMin: ${value.durationMin}
    Gauge Notes: ${JSON.stringify(value.gauge.notes)}
    `,
    season: null,
    seasonNumeric: [],

    river: { id: riverId },
    gauge: value.gauge.id ? { id: value.gauge.id } : null,
    levels: unit === 'm3s' ? null : binding,
    flows: unit === 'm3s' ? binding : null,
    flowsText: null,

    shape,
    distance: value.lengthMt / 1000,
    drop: null,
    duration: null,
    difficulty: parseDifficultyString(value.grade),
    difficultyXtra: value.grade,
    rating: null,
    tags: [],
    media: [],
    pois,
    hidden: true,
  };
};