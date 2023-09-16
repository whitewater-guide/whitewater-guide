import type { SectionResolvers } from '../../../apollo/index';

const createdByResolver: SectionResolvers['createdBy'] = (
  { created_by },
  _,
  { dataSources },
) => dataSources.users.getById(created_by);

export default createdByResolver;
