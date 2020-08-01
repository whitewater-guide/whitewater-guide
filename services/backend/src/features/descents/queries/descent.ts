import { TopLevelResolver } from '~/apollo';
import { DescentRaw } from '../types';

interface Vars {
  id?: string | null;
  shareToken?: string | null;
}

const descent: TopLevelResolver<Vars> = async (
  _,
  { id, shareToken },
  { dataSources },
) => {
  const result: DescentRaw | null = await dataSources.descents.getOne(
    id,
    shareToken,
  );
  return result;
};

export default descent;
