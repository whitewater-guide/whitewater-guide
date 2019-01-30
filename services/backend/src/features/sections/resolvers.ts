import { listResolvers } from '@apollo';
import { gaugeBindingResolver, sectionFieldResolvers } from './fields';
import Mutation from './mutations';
import Query from './queries';

export const sectionsResolvers = {
  Section: sectionFieldResolvers,
  GaugeBinding: gaugeBindingResolver,
  SectionsList: listResolvers,
  SectionMediaConnection: listResolvers,
  Query,
  Mutation,
};
