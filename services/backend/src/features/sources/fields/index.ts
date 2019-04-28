import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { Source } from '@whitewater-guide/commons';
import { SourceRaw } from '../types';
import gauges from './gauges';
import regions from './regions';
import status from './status';

const sourceResolvers: FieldResolvers<SourceRaw, Source> = {
  harvestMode: (src) => src.harvest_mode,
  termsOfUse: (src) => src.terms_of_use,
  requestParams: (src) => src.request_params,
  regions,
  gauges,
  status,
  ...timestampResolvers,
};

export default sourceResolvers;
