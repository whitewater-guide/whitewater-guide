import { StyleRulesCallback } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import SvgIcon from '@material-ui/core/SvgIcon';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { getApolloClient } from './apollo';
import Stepper from './stepper';
import { withRoot } from './theme';

type ClassNames = 'root' | 'card' | 'media' | 'actions' | 'copyright';

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
  actions: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
  },
  copyright: {
    color: '#ffffff',
    marginRight: 'auto',
  },
});

const apolloClient = getApolloClient();

class App extends React.PureComponent<WithStyles<ClassNames>> {
  render() {
    const { classes } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <div className={classes.root}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.media}
              image={`${process.env.PUBLIC_URL}/static/logo-header.png`}
              title="Whitewater.guide"
            />
            <CardContent>
              <Typography gutterBottom variant="title">
                Привет!
              </Typography>
              <Typography gutterBottom>
                Cпасибо еще раз что поддержали нас через <a href="https://boomstarter.ru/projects/866787/whitewaterguide_-_prilozhenie_dlya_kayakerov_i_turistov" target="_blank">Boomstarter.ru</a>!
                На этой странице вы можете активировать полученный по почте промокод и открыть для
                себя премиум регионы <b>whitewater.guide</b>
              </Typography>
              <Stepper />
            </CardContent>
            <CardActions className={classes.actions} disableActionSpacing color="primary">
              <Typography className={classes.copyright}>2016 - 2018 © whitewater.guide</Typography>
              <IconButton style={{ color: '#FFFFFF' }} href="https://vk.com/whitewater.guide" target="_blank">
                <SvgIcon viewBox="0 0 576 512">
                  <path d="M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7 0 0-30 73.1-72.4 120.5-13.7 13.7-20 18.1-27.5 18.1-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5 0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5-20 0-68.6-73.4-97.4-157.4-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7 0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9 0-66.8-3.4-73.1 15.4-73.1 8.7 0 23.7 4.4 58.7 38.1 40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25-11.2-34.9-86.9-106.7-90.3-111.5-8.7-11.2-6.2-16.2 0-26.2.1-.1 72-101.3 79.4-135.6z"/>
                </SvgIcon>
              </IconButton>
              <IconButton style={{ color: '#FFFFFF' }} href="https://www.facebook.com/whitewater.guideAPP/" target="_blank">
                <SvgIcon>
                  <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z" />
                </SvgIcon>
              </IconButton>
              <IconButton style={{ color: '#FFFFFF' }} href="mailto:mike@whitewater.guide">
                <Icon>email</Icon>
              </IconButton>
            </CardActions>
          </Card>
        </div>
      </ApolloProvider>
    );
  }
}

export default withRoot(withStyles(styles)(App));
