import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

const IMAGE_BASE = process.env.STORYBOOK_ENABLED
  ? ''
  : `${process.env.PUBLIC_URL}/static/`;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    image: {
      height: 48,
      marginRight: theme.spacing(2),
    },
  });

const Footer: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const { i18n } = useTranslation();
  return (
    <div className={classes.root}>
      <a href="https://play.google.com/store/apps/details?id=guide.whitewater">
        <img
          src={`${IMAGE_BASE}playstore_${i18n.language}.png`}
          className={classes.image}
        />
      </a>
      <a href="https://itunes.apple.com/us/app/whitewater-guide/id1386125994">
        <img
          src={`${IMAGE_BASE}appstore_${i18n.language}.png`}
          className={classes.image}
        />
      </a>
    </div>
  );
};

export default withStyles(styles)(Footer);
