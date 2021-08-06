import { SectionResolvers } from '~/apollo';

const shapeResolver: SectionResolvers['shape'] = ({ shape }) =>
  shape.coordinates;

export default shapeResolver;
