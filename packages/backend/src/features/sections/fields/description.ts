import { Context } from '@apollo';
import { GraphQLFieldResolver } from 'graphql';
import { SectionRaw } from '../types';

const descriptionResolver: GraphQLFieldResolver<SectionRaw, Context> =
  async (section, _, { models, purchasesLoader }) => {
    const { id, demo, description, premium, river_id, region_id } = section;
    if (!description || description.trim() === '') {
      return '';
    }
    try {
      await models.sections.assertEditorPermissions(id, river_id);
      return description;
    } catch (e) {/* Continue execution, user is not admin or editor */}
    if (premium && !demo) {
      const ids = await purchasesLoader.loadPurchasedRegions();
      return ids.includes(region_id) ? description : null;
    }
    return description;
  };

export default descriptionResolver;
