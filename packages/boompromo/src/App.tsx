import { StyleRulesCallback } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import React from 'react';
import Stepper from './stepper';
import { withRoot } from './theme';

type ClassNames = 'root' | 'card' | 'media';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 480,
    marginTop: theme.spacing.unit * 3,
  },
  media: {
    backgroundColor: theme.palette.primary.main,
    backgroundOrigin: 'content-box',
    height: 160,
    padding: theme.spacing.unit * 2,
  },
});

class App extends React.PureComponent<WithStyles<ClassNames>> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="/static/logo-header.png"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Stepper />
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(App));
