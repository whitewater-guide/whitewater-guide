import { FieldResolvers } from '@apollo';
import { Source } from '@whitewater-guide/commons';
import { SourceRaw } from '../types';
import enabled from './enabled';
import gauges from './gauges';
import regions from './regions';
import status from './status';
import { timestampResolvers } from '@db';

const sourceResolvers: FieldResolvers<SourceRaw, Source> = {
  termsOfUse: (src) => src.terms_of_use,
  requestParams: (src) => src.request_params,
  regions,
  gauges,
  enabled,
  status,
  ...timestampResolvers,
};

export default sourceResolvers;
