import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { purchaseActions } from '../../../../features/purchases';
import { consumeRegion } from '../../../../ww-clients/features/regions';
import { Region } from '../../../../ww-commons';

const container = compose(
  consumeRegion(),
  translate(),
  connect(
    undefined,
    { buyRegion: (region: Region) => purchaseActions.openDialog({ region }) },
  ),
);

export default container;
