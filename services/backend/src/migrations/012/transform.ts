import {
  Coordinate3d,
  GaugeBinding,
  Node,
  parseDifficultyString,
  PointInput,
  SectionInput,
} from '@whitewater-guide/commons';
import { RivermapSection } from './types';

export const transformRivermapSection = (
  section: RivermapSection,
  riverId: string,
): SectionInput => ({
  id: null,
  name: `${section.section} - [RIVERMAP.CH] `,
  altNames: null,
  description: `URL: ${section.url}\nType: ${section.type}`,
  season: null,
  seasonNumeric: [],
  river: { id: riverId },
  gauge: null,
  levels: null,
  flows: null,
  flowsText: null,
  shape: [
    [section.lngstart, section.latstart, 0],
    [section.lngend || section.lngstart, section.latend || section.latstart, 0],
  ],
  distance: null,
  drop: null,
  duration: null,
  difficulty: parseDifficultyString(section.generalGrade),
  difficultyXtra: section.generalGrade,
  rating: null,
  tags: [],
  pois: [],
  hidden: true,
});
