import {
  StyleRulesCallback,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import React from 'react';

const IMAGE_BASE = process.env.STORYBOOK_ENABLED
  ? ''
  : `${process.env.PUBLIC_URL}/static/`;

type ClassNames = 'root' | 'image';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  image: {
    height: 48,
    marginRight: theme.spacing.unit * 2,
  },
});

const Footer: React.SFC<WithStyles<ClassNames>> = ({ classes }) => (
  <div className={classes.root}>
    <a href="https://play.google.com/store/apps/details?id=guide.whitewater">
      <img src={`${IMAGE_BASE}playstore.png`} className={classes.image} />
    </a>
    <a href="https://itunes.apple.com/us/app/whitewater-guide/id1386125994">
      <img src={`${IMAGE_BASE}appstore.svg`} className={classes.image} />
    </a>
  </div>
);

export default withStyles(styles)(Footer);
