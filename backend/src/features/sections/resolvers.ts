import { listResolvers } from '../../apollo';
import Section from './fields';
// import Mutation from './mutations';
import Query from './queries';

export const sectionsResolvers = {
  Section,
  SectionsList: listResolvers,
  Query,
  // Mutation,
};
