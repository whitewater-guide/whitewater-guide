import { amber, green, grey, red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import FontIcon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { HarvestStatus } from '@whitewater-guide/commons';
import moment from 'moment';
import React from 'react';
import { Styles } from '../styles';

const styles: Styles = {
  popover: {
    backgroundColor: grey[100],
    padding: 8,
    minWidth: 360,
    overflow: 'hidden',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  btnWithText: {
    marginLeft: 0,
    width: undefined,
    paddingLeft: 0,
    paddingRight: 6,
  },
};

interface Props {
  status: HarvestStatus | null;
  withText?: boolean;
}

interface State {
  open: boolean;
  anchorEl: any;
}

export class HarvestStatusIndicator extends React.PureComponent<Props, State> {
  state: State = {
    open: false,
    anchorEl: null,
  };

  onClick = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  onClose = (event: React.MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      open: false,
      anchorEl: null,
    });
  };

  render() {
    const { status, withText } = this.props;
    const { open, anchorEl } = this.state;
    let color = grey[500];
    let tsStyle = {};
    let countStyle = {};
    let statusText = 'unknown';
    const error = status ? status.error : null;
    const now = moment();
    const ts = status ? moment(status.timestamp) : now;
    if (status) {
      color = status.success ? green[500] : red[500];
      statusText = status.success ? 'healthy' : 'error';
      if (status.count === 0) {
        countStyle = { color: red[500] };
        color = amber[500];
        statusText = 'empty response';
      }
      const diff = moment.duration(now.diff(ts)).asHours();
      if (diff > 24) {
        tsStyle = { color: red[500] };
        color = amber[500];
        statusText = 'stale data';
      }
    }
    return (
      <React.Fragment>
        <div style={styles.wrapper}>
          <IconButton
            disabled={!status}
            onClick={this.onClick}
            style={withText ? styles.btnWithText : undefined}
          >
            <FontIcon className="material-icons" style={{ color }}>
              fiber_manual_record
            </FontIcon>
          </IconButton>
          {withText && <span style={{ color }}>{statusText}</span>}
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={this.onClose}
          modal={true}
        >
          {status && (
            <Grid container={true} style={styles.popover}>
              <Grid container={true} style={tsStyle}>
                <Grid item={true} sm={4}>
                  <b>Timestamp</b>
                </Grid>
                <Grid item={true}>
                  {moment(status.timestamp).format('DD/MM/YYYY H:mm')}
                </Grid>
              </Grid>
              <Grid container={true} style={countStyle}>
                <Grid item={true} sm={4}>
                  <b>Measurements</b>
                </Grid>
                <Grid item={true}>{status.count.toString()}</Grid>
              </Grid>
              {!!error && (
                <Grid container={true} style={{ color: red[500] }}>
                  <Grid item={true} sm={12}>
                    {error}
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </Popover>
      </React.Fragment>
    );
  }
}
