import React, { Component, PropTypes } from 'react';
import withAdmin from '../../hoc/withAdmin';
import FlatLinkButton from '../../components/FlatLinkButton';

class ViewSourceLeft extends Component {

  static propTypes = {
    params: PropTypes.shape({
      sourceId: PropTypes.string,
    }),
    sourceLeft: PropTypes.element,
    admin: PropTypes.bool,
  };

  render() {
    return (
      <div style={styles.container}>
        {this.props.admin && <FlatLinkButton secondary={true} to={`/sources/${this.props.params.sourceId}/schedule`} label="Schedule" />}
        {this.props.admin && <FlatLinkButton secondary={true} to={`/sources/${this.props.params.sourceId}/settings`} label="Settings" />}
        <FlatLinkButton secondary={true} to={`/sources/${this.props.params.sourceId}/gauges`} label="Gauges" />
        {this.props.sourceLeft}
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

}

export default withAdmin(ViewSourceLeft);