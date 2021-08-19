import { Context, SectionResolvers } from '~/apollo';

import { ResolvableSection } from '../types';

const favoriteResolver: SectionResolvers<
  Context,
  ResolvableSection
>['favorite'] = ({ favorite }) => {
  return favorite ?? false;
};

export default favoriteResolver;
