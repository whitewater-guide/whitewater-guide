import type { GroupResolvers } from '../../../apollo/index';

const resolvers: GroupResolvers = {
  regions: ({ id }, _, { dataSources }, info) => {
    const query = dataSources.regions.getMany(info);
    query
      .innerJoin(
        'regions_groups',
        `regions_view.id`,
        'regions_groups.region_id',
      )
      .where('regions_groups.group_id', '=', id);
    return query;
  },
};

export default resolvers;
