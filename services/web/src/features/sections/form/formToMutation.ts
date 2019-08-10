import { Tag } from '@whitewater-guide/commons';
import { toMarkdown } from '@whitewater-guide/md-editor';
import { SectionFormData } from './types';
import { MVars } from './upsertSection.mutation';

export default (form: SectionFormData): MVars => {
  const {
    kayakingTags,
    hazardsTags,
    supplyTags,
    miscTags,
    description,
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
      tags,
      description: toMarkdown(description),
    },
  };
};
