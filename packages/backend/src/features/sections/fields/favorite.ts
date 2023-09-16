import type { Context, SectionResolvers } from '../../../apollo/index';
import type { ResolvableSection } from '../types';

const favoriteResolver: SectionResolvers<
  Context,
  ResolvableSection
>['favorite'] = ({ favorite }) => {
  return favorite ?? false;
};

export default favoriteResolver;
