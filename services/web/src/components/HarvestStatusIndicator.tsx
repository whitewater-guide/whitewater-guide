import { HarvestStatus } from '@whitewater-guide/commons';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import {
  amber500,
  green500,
  grey100,
  grey500,
  red500,
} from 'material-ui/styles/colors';
import moment from 'moment';
import React from 'react';
import { Col, Container, Row } from 'react-grid-system';
import { Styles } from '../styles';

const styles: Styles = {
  popover: {
    backgroundColor: grey100,
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

  onClose = () => {
    this.setState({
      open: false,
      anchorEl: null,
    });
  };

  render() {
    const { status, withText } = this.props;
    const { open, anchorEl } = this.state;
    let color = grey500;
    let tsStyle = {};
    let countStyle = {};
    let statusText = 'unknown';
    const error = status ? status.error : null;
    const now = moment();
    const ts = status ? moment(status.timestamp) : now;
    if (status) {
      color = status.success ? green500 : red500;
      statusText = status.success ? 'healthy' : 'error';
      if (status.count === 0) {
        countStyle = { color: red500 };
        color = amber500;
        statusText = 'empty response';
      }
      const diff = moment.duration(now.diff(ts)).asHours();
      if (diff > 24) {
        tsStyle = { color: red500 };
        color = amber500;
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
            <FontIcon className="material-icons" color={color}>
              fiber_manual_record
            </FontIcon>
          </IconButton>
          {withText && <span style={{ color }}>{statusText}</span>}
        </div>
        <Popover open={open} anchorEl={anchorEl} onRequestClose={this.onClose}>
          {status && (
            <Container style={styles.popover}>
              <Row style={tsStyle}>
                <Col sm={4}>
                  <b>Timestamp</b>
                </Col>
                <Col>{moment(status.timestamp).format('DD/MM/YYYY H:mm')}</Col>
              </Row>
              <Row style={countStyle}>
                <Col sm={4}>
                  <b>Measurements</b>
                </Col>
                <Col>{status.count.toString()}</Col>
              </Row>
              {!!error && (
                <Row style={{ color: red500 }}>
                  <Col sm={12}>{error}</Col>
                </Row>
              )}
            </Container>
          )}
        </Popover>
      </React.Fragment>
    );
  }
}
