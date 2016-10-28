import React, {Component, PropTypes} from "react";
import withAdmin from "../../hoc/withAdmin";
import FlatLinkButton from "../../components/FlatLinkButton";

class ListRiversLeft extends Component {

  static propTypes = {
    admin: PropTypes.bool,
  };

  render() {
    const {admin} = this.props;
    return (
      <div style={styles.container}>
        {admin && <FlatLinkButton secondary={true} to="/rivers/new" label="New River" />}
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