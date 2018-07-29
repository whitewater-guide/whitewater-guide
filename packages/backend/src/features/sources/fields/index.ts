import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { Source } from '@ww-commons';
import { SourceRaw } from '../types';
import status from './status';

const Source: FieldResolvers<SourceRaw, Source> = {
  harvestMode: src => src.harvest_mode,
  termsOfUse: src => src.terms_of_use,
  regions: () => ({ nodes: [], count: 0 }),
  gauges: ({ id }, { page }, { models }, info) =>
    models.gauges.getMany(info, { page, where: { source_id: id } }),
  status,
  ...timestampResolvers,
};

export default Source;
