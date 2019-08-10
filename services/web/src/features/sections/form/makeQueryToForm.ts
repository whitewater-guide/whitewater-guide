import { fromMarkdown } from '@whitewater-guide/md-editor';
import { flow, groupBy } from 'lodash/fp';
import { toNamedNode } from '../../../formik/utils';
import { QResult } from './sectionForm.query';
import { SectionFormData } from './types';

export default (isCopy?: boolean) => (result: QResult): SectionFormData => {
  if (!result || !result.section) {
    // Deliberately allow null. Initial form value will be invalid
    const river: any = result ? result.river : null;
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
      hazardsTags: [],
      kayakingTags: [],
      miscTags: [],
      supplyTags: [],
      levels: null,
      flows: null,
    };
  }
  const { tags, id, name, description, demo, ...section } = result.section;
  const {
    kayaking: kayakingTags = [],
    hazards: hazardsTags = [],
    supply: supplyTags = [],
    misc: miscTags = [],
  } = flow(groupBy('category'))(tags);

  return {
    id: isCopy ? null : id,
    name: isCopy ? '' : name,
    ...section,
    river: toNamedNode(section.river),
    region: toNamedNode(result.region),
    description: fromMarkdown(description),
    kayakingTags,
    hazardsTags,
    supplyTags,
    miscTags,
  };
};
