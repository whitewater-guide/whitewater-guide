import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import { AuthService } from '@whitewater-guide/clients';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import StepperWithAuth from './StepperWithAuth';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      maxWidth: 480,
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    media: {
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      backgroundOrigin: 'content-box',
      backgroundSize: 'cover',
      padding: theme.spacing(2),
    },
    actions: {
      backgroundColor: theme.palette.primary.main,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    copyright: {
      color: '#ffffff',
    },
    version: {
      fontSize: 10,
      color: 'rgba(0,0,0,0.5)',
    },
  }),
);

interface Props {
  service: AuthService;
}

export const RootLayout: React.FC<Props> = React.memo(({ service }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardMedia title="Whitewater.guide">
          <img
            src={`${process.env.PUBLIC_URL}/static/logo-header.png`}
            className={classes.media}
          />
        </CardMedia>
        <CardContent>
          <Typography gutterBottom={true} variant="h6">
            {t('main:title')}
          </Typography>
          <Typography gutterBottom={true}>
            <Trans i18nKey="main:description">
              1
              <a href="https://www.indiegogo.com/projects/whitewater-guide-app-for-the-whitewater-community#/">
                IndieGoGo
              </a>
              2
              <a
                href="https://boomstarter.ru/projects/866787/whitewaterguide_-_prilozhenie_dlya_kayakerov_i_turistov"
                target="_blank"
              >
                Boomstarter.ru
              </a>
              3<b>4</b>5
            </Trans>
          </Typography>
          <StepperWithAuth service={service} />
        </CardContent>
        <CardActions
          className={classes.actions}
          disableSpacing={true}
          color="primary"
        >
          <Typography className={classes.copyright}>
            2016 - 2019 © whitewater.guide
          </Typography>
          <div>
            <IconButton
              style={{ color: '#FFFFFF' }}
              href="https://play.google.com/store/apps/details?id=guide.whitewater"
              target="_blank"
            >
              <SvgIcon viewBox="0 0 505 505">
                <path d="m68.541 164.715h-1.294c-16.588 0-30.113 13.568-30.113 30.113v131.107c0 16.61 13.525 30.134 30.113 30.134h1.316c16.588 0 30.113-13.568 30.113-30.134v-131.108c-.022-16.544-13.568-30.112-30.135-30.112z" />
                <path d="m113.085 376.54c0 15.229 12.446 27.632 27.675 27.632h29.574v70.817c0 16.631 13.568 30.156 30.113 30.156h1.294c16.61 0 30.156-13.546 30.156-30.156v-70.817h41.33v70.817c0 16.631 13.611 30.156 30.156 30.156h1.273c16.609 0 30.134-13.546 30.134-30.156v-70.817h29.595c15.207 0 27.654-12.403 27.654-27.632v-207.015h-278.954z" />
                <path d="m322.041 43.983 23.491-36.26c1.51-2.287.841-5.414-1.467-6.903-2.286-1.51-5.414-.884-6.903 1.467l-24.353 37.512c-18.27-7.485-38.676-11.691-60.226-11.691-21.571 0-41.934 4.206-60.247 11.691l-24.31-37.512c-1.488-2.351-4.638-2.977-6.946-1.467-2.308 1.488-2.977 4.616-1.467 6.903l23.512 36.26c-42.387 20.773-70.968 59.924-70.968 104.834 0 2.761.173 5.479.41 8.175h280.053c.237-2.696.388-5.414.388-8.175.001-44.91-28.602-84.061-70.967-104.834zm-134.386 64.928c-7.442 0-13.482-5.997-13.482-13.46s6.04-13.439 13.482-13.439c7.485 0 13.482 5.975 13.482 13.439s-6.04 13.46-13.482 13.46zm129.835 0c-7.442 0-13.482-5.997-13.482-13.46s6.04-13.439 13.482-13.439c7.463 0 13.46 5.975 13.46 13.439 0 7.463-5.997 13.46-13.46 13.46z" />
                <path d="m437.876 164.715h-1.251c-16.588 0-30.156 13.568-30.156 30.113v131.107c0 16.61 13.59 30.134 30.156 30.134h1.273c16.609 0 30.113-13.568 30.113-30.134v-131.108c0-16.544-13.547-30.112-30.135-30.112z" />
              </SvgIcon>
            </IconButton>
            <IconButton
              style={{ color: '#FFFFFF' }}
              href="https://itunes.apple.com/us/app/whitewater-guide/id1386125994"
              target="_blank"
            >
              <SvgIcon viewBox="0 0 170 170">
                <path d="m150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zm-31.26-123.01c0 8.1021-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.3113 11.45-8.597 4.62-2.2516 8.99-3.4968 13.1-3.71 0.12 1.0831 0.17 2.1663 0.17 3.2409z" />
              </SvgIcon>
            </IconButton>
            <IconButton
              style={{ color: '#FFFFFF' }}
              href="https://vk.com/whitewater.guide"
              target="_blank"
            >
              <SvgIcon viewBox="0 0 576 512">
                <path d="M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7 0 0-30 73.1-72.4 120.5-13.7 13.7-20 18.1-27.5 18.1-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5 0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5-20 0-68.6-73.4-97.4-157.4-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7 0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9 0-66.8-3.4-73.1 15.4-73.1 8.7 0 23.7 4.4 58.7 38.1 40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25-11.2-34.9-86.9-106.7-90.3-111.5-8.7-11.2-6.2-16.2 0-26.2.1-.1 72-101.3 79.4-135.6z" />
              </SvgIcon>
            </IconButton>
            <IconButton
              style={{ color: '#FFFFFF' }}
              href="https://www.facebook.com/whitewater.guideAPP/"
              target="_blank"
            >
              <SvgIcon>
                <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z" />
              </SvgIcon>
            </IconButton>
            <IconButton
              style={{ color: '#FFFFFF' }}
              href="mailto:mike@whitewater.guide"
            >
              <Icon>email</Icon>
            </IconButton>
          </div>
        </CardActions>
      </Card>
      <div className={classes.version}>{`v${
        require('../../package.json').version
      }`}</div>
    </div>
  );
});

RootLayout.displayName = 'RootLayout';
