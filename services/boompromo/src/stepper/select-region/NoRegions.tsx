import Icon from '@material-ui/core/Icon/Icon';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

type ClassNames = 'root' | 'icon' | 'iconRow';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
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
    margin: theme.spacing.unit,
    marginLeft: 0,
  },
});

const NoRegions: React.SFC<WithStyles<ClassNames>> = ({ classes }) => (
  <div className={classes.root}>
    <div className={classes.iconRow}>
      <Icon className={classes.icon}>warning</Icon>
      <Typography variant="subheading" gutterBottom>
        Нет доступных регионов
      </Typography>
    </div>
    <Typography variant="caption" gutterBottom>
      Возможно, вы уже приобрели все доступные премиум-регионы
    </Typography>
  </div>
);

export default withStyles(styles)(NoRegions);
