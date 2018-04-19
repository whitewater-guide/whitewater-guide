import { translate } from 'react-i18next';
import { compose } from 'recompose';
import { withRegionsList } from '../../ww-clients/features/regions';
import { InnerProps, OuterProps } from './types';

const container = compose<InnerProps, OuterProps>(
  translate(),
  withRegionsList,
);

export default container;
