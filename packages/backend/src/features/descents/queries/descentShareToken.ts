import { QueryResolvers } from '~/apollo';

const descentShareToken: QueryResolvers['descentShareToken'] = (
  _,
  { id },
  { dataSources },
) => dataSources.descents.getShareToken(id);

export default descentShareToken;
