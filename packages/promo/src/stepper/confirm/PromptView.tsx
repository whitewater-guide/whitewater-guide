import Divider from '@material-ui/core/Divider';
import FormHelperText from '@material-ui/core/FormHelperText';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import type { BoomPromoInfo } from '@whitewater-guide/schema';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { StepFooter } from '../../components';
import type { PromoRegionFragment } from '../promoRegion.generated';

const useStyles = makeStyles((theme) =>
  createStyles({
    divider: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  }),
);

export interface PromptViewProps {
  region: PromoRegionFragment | null;
  promo: BoomPromoInfo;
  username?: string | null;
  loading?: boolean;
  error?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

export const PromptView: React.FC<PromptViewProps> = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { region, promo, username, loading, error, onNext, onPrev } = props;
  const { i18nKey, values } = useMemo(
    () => ({
      i18nKey: `confirm:prompt.list.${region ? 'region' : 'group'}`,
      values: {
        name: region ? region.name : promo?.groupName,
        username,
      },
    }),
    [region, promo, username],
  );
  if (!promo) {
    return null;
  }
  return (
    <>
      <Typography variant="subtitle1">
        <Trans i18nKey="confirm:prompt.subtitle" values={promo}>
          1<strong>2</strong>
        </Trans>
      </Typography>
      <Typography>{t('confirm:prompt.check')}</Typography>
      <Typography component="ul">
        <Trans i18nKey={i18nKey} values={values}>
          <li>
            1<strong>2</strong>
          </li>
          <li>
            3<strong>4</strong>
          </li>
        </Trans>
      </Typography>
      <FormHelperText error hidden={!error}>
        {error}
      </FormHelperText>
      <Divider className={classes.divider} />
      <StepFooter
        onPrev={onPrev}
        onNext={onNext}
        nextDisabled={false}
        nextLoading={!!loading}
        nextLabel={t('confirm:prompt.activateButton')}
      />
    </>
  );
};
