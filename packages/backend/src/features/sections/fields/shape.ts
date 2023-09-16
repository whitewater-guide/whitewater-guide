import type { SectionResolvers } from '../../../apollo/index';

const shapeResolver: SectionResolvers['shape'] = ({ shape }) =>
  shape.coordinates;

export default shapeResolver;
