import { TopLevelResolver } from '~/apollo';

const banners: TopLevelResolver<{}> = (_, __, { dataSources }, info) =>
  dataSources.banners.getMany(info);

export default banners;
