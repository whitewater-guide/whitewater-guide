import { compose, pure } from 'recompose';
import { withLoading } from '../../components';
import { withFeatureIds } from '../../ww-clients/core';
import { withSection, WithSection } from '../../ww-clients/features/sections';
import { InnerProps, OuterProps } from './types';

export default compose<InnerProps & OuterProps, OuterProps>(
  withFeatureIds('section'),
  withSection(),
  withLoading<WithSection>((props) => props.section.loading),
  pure,
);
