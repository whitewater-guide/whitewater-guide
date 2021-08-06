import Icon from '@material-ui/core/Icon/Icon';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    iconRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      margin: theme.spacing(),
      marginLeft: 0,
    },
  }),
);

const NoRegions: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      <div className={classes.iconRow}>
        <Icon className={classes.icon}>warning</Icon>
        <Typography variant="subtitle1" gutterBottom>
          {t('select:noRegionsTitle')}
        </Typography>
      </div>
      <Typography variant="caption" gutterBottom>
        {t('select:noRegionsSubtitle')}
      </Typography>
    </div>
  );
};

export default NoRegions;
