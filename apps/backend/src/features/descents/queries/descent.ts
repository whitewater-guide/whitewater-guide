import type { QueryResolvers } from '../../../apollo/index';
import type { Sql } from '../../../db/index';

const descent: QueryResolvers['descent'] = async (
  _,
  { id, shareToken },
  { dataSources },
) => {
  const result: Sql.Descents | null = await dataSources.descents.getOne(
    id,
    shareToken,
  );
  return result;
};

export default descent;
