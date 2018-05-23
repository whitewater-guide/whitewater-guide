import Divider from '@material-ui/core/Divider';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import FacebookButton from './FacebookButton';

type ClassNames = 'divider' | 'root';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
});

interface Props extends WithStyles<ClassNames> {
  login: () => void;
}

const AnonView: React.SFC<Props> = ({ login, classes }) => (
  <div className={classes.root}>
    <Typography align="justify">
      Вход в приложение whitewater.guide осуществляется через Facebook. Войдите через тот же аккаунт Facebook,
      который вы собираетесь использовать в мобильном приложении.
    </Typography>
    <FacebookButton label="Войти через Facebook" onClick={login} />
    <Divider className={classes.divider}/>
  </div>
);

export default withStyles(styles)(AnonView);
