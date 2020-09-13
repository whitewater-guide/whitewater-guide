import { SectionInput } from '@whitewater-guide/commons';

import { GaugeRaw } from '~/features/gauges';

export interface InputSection {
  gauge_location_code: string;
  grade: string;
  guidebook_link: string;
  scrape_value: string;
  low_value: string; // --> minimum
  medium_value: string; // --> optimum
  high_value: string; // --> maximum
  very_high_value: string;
  huge_value: string; // --> impossible
  name: string;
  sca_guidebook_no: string; // used as id
  put_in_lat: string;
  put_in_long: string;
  get_out_lat: string;
  get_out_long: string;

  // Computed
  difficulty: number;
  difficultyXtra?: string;
  sectionName: string;
  riverName: string;
}

const convertGrade = (grade: string): [number, string | undefined] => {
  const [_, fStr, sStr, __, extra] = grade
    .trim()
    .match(/(\d)[/\-+]?(\d?)\s*(\((.*)\))?/)!;
  const first = parseInt(fStr, 10);
  if (sStr) {
    const second = parseInt(sStr, 10);
    return [(first + second) / 2, extra];
  }
  return [first, extra];
};

const convertName = (name: string): [string, string] => {
  const [_, river, __, section] = name.match(/([^()]*)(\((.*)\))?/)!;
  return [river.trim(), section ? section.trim() : river.trim()];
};

export const normalize = (section: InputSection) => {
  const [difficulty, difficultyXtra] = convertGrade(section.grade);
  const [riverName, sectionName] = convertName(section.name);
  section.difficulty = difficulty;
  section.difficultyXtra = difficultyXtra;
  section.sectionName = sectionName;
  section.riverName = riverName;
};

export const getTransform = (gauges: GaugeRaw[]) => (
  value: InputSection,
  riverId: string,
): Omit<SectionInput, 'helpNeeded'> => {
  const gauge = gauges.find(({ code }) => code === value.gauge_location_code);
  return {
    id: null,
    name: `${value.sectionName} - [IMPORTED]`,
    altNames: null,
    description: `sca guidebook no ${value.sca_guidebook_no}`,
    season: null,
    seasonNumeric: [],
    river: { id: riverId },
    gauge: gauge ? { id: gauge.id } : null,
    levels: {
      minimum: parseFloat(value.low_value),
      optimum: parseFloat(value.medium_value),
      maximum: parseFloat(value.high_value),
      impossible: parseFloat(value.huge_value),
      approximate: null,
    },
    flows: null,
    flowsText: null,
    shape: [
      [parseFloat(value.put_in_long), parseFloat(value.put_in_lat), 0],
      [parseFloat(value.get_out_long), parseFloat(value.get_out_lat), 0],
    ],
    distance: null,
    drop: null,
    duration: null,
    difficulty: value.difficulty,
    difficultyXtra: value.difficultyXtra || null,
    rating: null,
    tags: [],
    pois: [],
    media: [],
    hidden: true,
  };
};
