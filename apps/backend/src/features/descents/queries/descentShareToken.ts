import type { QueryResolvers } from '../../../apollo/index';

const descentShareToken: QueryResolvers['descentShareToken'] = (
  _,
  { id },
  { dataSources },
) => dataSources.descents.getShareToken(id);

export default descentShareToken;
