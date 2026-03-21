import type { SourceResolvers } from '../../../apollo/index';
import { timestampedResolvers } from '../../../apollo/index';
import enabled from './enabled';
import gauges from './gauges';
import regions from './regions';
import status from './status';

const sourceResolvers: SourceResolvers = {
  termsOfUse: (src) => src.terms_of_use,
  requestParams: (src) => src.request_params,
  regions,
  gauges,
  enabled,
  status,
  ...timestampedResolvers,
};

export default sourceResolvers;
