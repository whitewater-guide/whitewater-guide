import { toMarkdown } from '@whitewater-guide/md-editor';
import { Tag } from '@whitewater-guide/schema';
import upperFirst from 'lodash/upperFirst';

import { SectionFormData } from './types';
import { UpsertSectionMutationVariables } from './upsertSection.generated';

export default (form: SectionFormData): UpsertSectionMutationVariables => {
  const {
    kayakingTags,
    hazardsTags,
    supplyTags,
    miscTags,
    description,
    name,
    ...rest
  } = form;
  const tags = [
    ...kayakingTags,
    ...hazardsTags,
    ...supplyTags,
    ...miscTags,
  ].map((tag: Tag) => ({ id: tag.id }));

  return {
    section: {
      ...rest,
      name: upperFirst(name.trim()),
      tags,
      description: toMarkdown(description),
    },
  };
};
