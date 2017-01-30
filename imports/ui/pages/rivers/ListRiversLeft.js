import React, {Component, PropTypes} from "react";
import withAdmin from "../../hoc/withAdmin";
import FlatLinkButton from "../../components/FlatLinkButton";
import _ from 'lodash';

class ListRiversLeft extends Component {

  static propTypes = {
    admin: PropTypes.bool,
    router: PropTypes.object,
    location: PropTypes.object,
  };

  render() {
    const {admin, location} = this.props;
    const toNewRiver = {
      pathname: '/rivers/new',
    };
    const regionId = _.get(location, 'query.regionId');
    if (regionId)
      toNewRiver.query = {regionId};
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

export default withAdmin(ListRiversLeft);