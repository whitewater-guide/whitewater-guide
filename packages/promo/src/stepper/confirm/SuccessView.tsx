import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { BoomPromoInfo, Region } from '@whitewater-guide/commons';
import React, { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Footer from './Footer';

export interface SuccessViewProps {
  region: Region | null;
  promo: BoomPromoInfo;
}

const SuccessView: React.FC<SuccessViewProps> = ({ region, promo }) => {
  const { t } = useTranslation();
  const onRestart = useCallback(() => window.location.reload(true), []);
  const { values, i18nKey } = useMemo(
    () => ({
      values: { name: region ? region.name : promo.groupName },
      i18nKey: 'confirm:success.description.' + (region ? 'region' : 'group'),
    }),
    [region, promo],
  );
  return (
    <React.Fragment>
      <Typography gutterBottom={true} variant="h5">
        {t('confirm:success.title')}
      </Typography>
      <Typography gutterBottom={true}>
        <Trans i18nKey={i18nKey} values={values}>
          1
          <br />
          <br />2<strong>{'{{ name }}'}</strong>
          <br />
          <br />3
        </Trans>
      </Typography>
      <Footer />
      <Button color="primary" onClick={onRestart} size="small">
        {t('confirm:success.restart')}
      </Button>
    </React.Fragment>
  );
};

export default SuccessView;
