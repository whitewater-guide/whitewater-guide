import React, {Component, PropTypes} from "react";
import {FlatLinkButton} from "../../core/components";
import _ from 'lodash';
import container from './ListRIversLeftContainer';

class ListRiversLeft extends Component {

  static propTypes = {
    admin: PropTypes.bool,
    regionId: PropTypes.string,
  };

  render() {
    const {admin, regionId} = this.props;
    const toNewRiver = {
      pathname: '/rivers/new',
    };
    if (regionId)
      toNewRiver.search = `?regionId=${regionId}`;
    return (
      <div style={styles.container}>
        {admin && <FlatLinkButton secondary={true} to={toNewRiver} label="New River" />}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
};

export default container(ListRiversLeft);