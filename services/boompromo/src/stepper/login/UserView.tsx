import Avatar from '@material-ui/core/Avatar';
import {
  StyleRulesCallback,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { FacebookProfile } from '../../auth/fb';
import FacebookButton from './FacebookButton';

type ClassNames = 'root' | 'row' | 'avatar';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  avatar: {
    margin: theme.spacing.unit,
    marginLeft: 0,
    width: 50,
    height: 50,
  },
});

interface Props extends WithStyles<ClassNames> {
  user: FacebookProfile;
  logout: () => void;
}

const UserView: React.SFC<Props> = ({ classes, user, logout }) => (
  <div className={classes.root}>
    <Typography variant="subheading">Привет!</Typography>
    <div className={classes.row}>
      <Avatar src={user.picture.data.url} className={classes.avatar} />
      <Typography variant="subheading">{user.name}</Typography>
    </div>
    <Typography gutterBottom={true} align="justify">
      Вход в приложение whitewater.guide осуществляется через Facebook. Войдите
      через тот же аккаунт Facebook, который вы собираетесь использовать в
      мобильном приложении.
    </Typography>
    <FacebookButton label="Выйти" onClick={logout} />
  </div>
);

export default withStyles(styles)(UserView);
