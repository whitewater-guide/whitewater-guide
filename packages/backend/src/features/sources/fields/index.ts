import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Source } from '../../../ww-commons';
import { SourceRaw } from '../types';

const Source: FieldResolvers<SourceRaw, Source> = {
  harvestMode: src => src.harvest_mode,
  termsOfUse: src => src.terms_of_use,
  ...timestampResolvers,
};

export default Source;
