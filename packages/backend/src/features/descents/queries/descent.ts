import { QueryResolvers } from '~/apollo';
import { Sql } from '~/db';

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
