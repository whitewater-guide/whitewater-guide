import { Tag } from '@whitewater-guide/commons';
import { toMarkdown } from '@whitewater-guide/md-editor';
import upperFirst from 'lodash/upperFirst';
import { SectionFormData } from './types';
import { MVars } from './upsertSection.mutation';

export default (form: SectionFormData): MVars => {
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
