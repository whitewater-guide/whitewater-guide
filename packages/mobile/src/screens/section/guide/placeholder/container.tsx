import { translate } from 'react-i18next';
import { compose, pure } from 'recompose';
import { consumeRegion } from '../../../../ww-clients/features/regions';

const container = compose(
  consumeRegion(),
  translate(),
  pure,
);

export default container;
