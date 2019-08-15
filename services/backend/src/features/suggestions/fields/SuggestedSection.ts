import { FieldResolvers } from '@apollo';
import { SectionInput, SuggestedSection } from '@whitewater-guide/commons';
import { SuggestedSectionRaw } from '../types';

const suggestedSectionResolvers: FieldResolvers<
  SuggestedSectionRaw,
  SuggestedSection<SectionInput>
> = {
  createdAt: ({ created_at }) => new Date(created_at).toISOString(),
  section: ({ id, section }) => ({ ...section, suggestionId: id }),
};

export default suggestedSectionResolvers;
