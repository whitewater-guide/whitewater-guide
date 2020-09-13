import { Tag } from '@whitewater-guide/commons';
import { fromMarkdown } from '@whitewater-guide/md-editor';
import { flow, groupBy } from 'lodash/fp';

import { toNamedNode } from '../../../formik/utils';
import { QResult } from './sectionForm.query';
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

export default (isCopy?: boolean) => (result: QResult): SectionFormData => {
  if (!result || !result.section) {
    // Deliberately allow null. Initial form value will be invalid
    const river: any = (result && result.river) || { id: null, name: '' };
    return {
      id: null,
      river,
      region: toNamedNode(result.region),
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
    };
  }
  const {
    tags,
    id,
    name,
    description,
    demo,
    media,
    verified,
    ...section
  } = result.section;
  return {
    id: isCopy ? null : id,
    name: isCopy ? '' : name,
    ...section,
    media: media.nodes,
    river: toNamedNode(section.river),
    region: toNamedNode(result.region),
    description: fromMarkdown(description),
    ...groupTags(tags),
  };
};
