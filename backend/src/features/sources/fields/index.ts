import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db/types';
import { Source, SourceRaw } from '../types';

const Source: FieldResolvers<SourceRaw, Source> = {
  harvestMode: src => src.harvest_mode,
  termsOfUse: src => src.terms_of_use,
  ...timestampResolvers,
};

export default Source;
