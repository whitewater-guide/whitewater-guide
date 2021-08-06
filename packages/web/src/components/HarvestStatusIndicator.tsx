/* eslint-disable import/no-duplicates */
import { amber, green, grey, red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import FontIcon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { formatDate } from '@whitewater-guide/clients';
import { HarvestStatus } from '@whitewater-guide/schema';
import differenceInHours from 'date-fns/differenceInHours';
import parseISO from 'date-fns/parseISO';
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
  status?: HarvestStatus | null;
  withText?: boolean;
}

interface State {
  open: boolean;
  anchorEl: Element | null;
}

export class HarvestStatusIndicator extends React.PureComponent<Props, State> {
  state: State = {
    open: false,
    anchorEl: null,
  };

  onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  onClose = (event: React.MouseEvent) => {
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
    let color: string = grey[500];
    let tsStyle = {};
    let countStyle = {};
    let statusText = 'unknown';
    const error = status ? status.error : null;
    const now = new Date();
    const ts = status?.timestamp ? parseISO(status.timestamp) : now;
    if (status) {
      color = status.success ? green[500] : red[500];
      statusText = status.success ? 'healthy' : 'error';
      if (status.count === 0) {
        countStyle = { color: red[500] };
        color = amber[500];
        statusText = 'empty response';
      }
      const diff = differenceInHours(now, ts);
      if (diff > 24) {
        tsStyle = { color: red[500] };
        color = amber[500];
        statusText = 'stale data';
      }
    }
    return (
      <>
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
        <Popover open={open} anchorEl={anchorEl} onClose={this.onClose}>
          {status && (
            <Grid container style={styles.popover}>
              {status.timestamp && (
                <Grid container style={tsStyle}>
                  <Grid item sm={4}>
                    <b>Timestamp</b>
                  </Grid>
                  <Grid item>
                    {formatDate(parseISO(status.timestamp), 'dd/MM/yyyy H:mm')}
                  </Grid>
                </Grid>
              )}

              {status.next && (
                <Grid container style={tsStyle}>
                  <Grid item sm={4}>
                    <b>Next</b>
                  </Grid>
                  <Grid item>
                    {formatDate(parseISO(status.next), 'dd/MM/yyyy H:mm')}
                  </Grid>
                </Grid>
              )}

              <Grid container style={countStyle}>
                <Grid item sm={4}>
                  <b>Measurements</b>
                </Grid>
                <Grid item>{status.count?.toString()}</Grid>
              </Grid>

              {!!error && (
                <Grid container style={{ color: red[500] }}>
                  <Grid item sm={12}>
                    {error}
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </Popover>
      </>
    );
  }
}
