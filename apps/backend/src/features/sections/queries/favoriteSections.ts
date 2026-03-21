import type { QueryResolvers } from '../../../apollo/index';
import { isAuthenticatedResolver } from '../../../apollo/index';

const favoriteSections: QueryResolvers['favoriteSections'] = async (
  _,
  { regionId },
  { user, dataSources },
  info,
) => {
  let query = dataSources.sections
    .getMany(info)
    .innerJoin('fav_sections', 'sections_view.id', 'fav_sections.section_id');
  query = query.where('user_id', user!.id);
  if (regionId) {
    query = query.where({ region_id: regionId });
  }
  const result = await query;
  return result;
};

export default isAuthenticatedResolver(favoriteSections);
