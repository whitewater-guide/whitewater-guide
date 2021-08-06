import { fromMarkdown } from '@whitewater-guide/md-editor';
import { NamedNode, Tag } from '@whitewater-guide/schema';
import { flow, groupBy } from 'lodash/fp';

import { toNamedNode } from '../../../formik/utils';
import { SectionFormQuery } from './sectionForm.generated';
import { SectionFormData } from './types';

const groupTags = (tags: Tag[]) => {
  const grouped = flow(groupBy('category'))(tags);
  return {
    kayakingTags: grouped.kayaking || [],
    hazardsTags: grouped.hazards || [],
    supplyTags: grouped.supply || [],
    miscTags: grouped.misc || [],
  };
};

const simplifyShape = (shape: CodegenCoordinates[]): CodegenCoordinates[] => [
  shape[0],
  shape[shape.length - 1],
];

const emptySection = (region: NamedNode, river: any): SectionFormData => ({
  id: null,
  river,
  region: toNamedNode(region),
  name: '',
  altNames: [],
  season: null,
  seasonNumeric: [],
  gauge: null,
  flowsText: null,
  shape: [],
  distance: null,
  drop: null,
  duration: null,
  difficulty: 0,
  difficultyXtra: null,
  rating: null,
  pois: [],
  description: fromMarkdown(null),
  hidden: false,
  helpNeeded: null,
  hazardsTags: [],
  kayakingTags: [],
  miscTags: [],
  supplyTags: [],
  levels: null,
  flows: null,
  media: [],
  license: null,
  copyright: null,
});

export default (isCopy?: boolean) =>
  (result: SectionFormQuery): SectionFormData => {
    if (!result.region) {
      throw new Error('region not found');
    }
    if (!result.section) {
      // Deliberately allow null. Initial form value will be invalid
      const river = result?.river || { id: null, name: '' };
      return emptySection(result.region, river);
    }
    const {
      tags,
      description,
      demo: _demo,
      media,
      verified: _verified,
      ...section
    } = result.section;

    if (isCopy) {
      return {
        ...emptySection(result.region, toNamedNode(section.river)),
        shape: simplifyShape(section.shape),
        description: fromMarkdown(description),
        season: section.season,
        seasonNumeric: section.seasonNumeric,
        gauge: section.gauge,
        ...groupTags(tags),
      };
    }

    return {
      ...section,
      media: media.nodes,
      river: toNamedNode(section.river),
      region: toNamedNode(result.region),
      description: fromMarkdown(description),
      ...groupTags(tags),
    };
  };
