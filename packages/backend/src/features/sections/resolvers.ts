import { listResolvers } from '../../apollo/index';
import { gaugeBindingResolver, sectionFieldResolvers } from './fields/index';
import Mutation from './mutations/index';
import Query from './queries/index';

export const sectionsResolvers = {
  Section: sectionFieldResolvers,
  GaugeBinding: gaugeBindingResolver,
  SectionsList: listResolvers,
  SectionMediaConnection: listResolvers,
  Query,
  Mutation,
};
