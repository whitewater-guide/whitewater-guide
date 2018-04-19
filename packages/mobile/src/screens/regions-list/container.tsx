import { translate } from 'react-i18next';
import { compose } from 'recompose';
import { withRegionsList } from '../../ww-clients/features/regions';

const container = compose(
  translate(),
  withRegionsList,
);

export default container;
