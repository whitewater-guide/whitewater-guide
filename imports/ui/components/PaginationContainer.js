import React, {Component, PropTypes} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Waypoint from 'react-waypoint';

class PaginationContainer extends Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    loadMore: PropTypes.func.isRequired,
    style: PropTypes.any,
    scrollable: PropTypes.bool,
  };

  static defaultProps = {
    scrollable: true,
  };

  render() {
    return (
      <div style={this.props.style}>
        <div style={styles.scrollContainer}>
          {this.props.children}
          {this.renderLoading()}
          {this.renderButton()}
          {this.renderWaypoint()}
        </div>
      </div>
    );
  }

  renderWaypoint = () => {
    if (this.props.loading || !this.props.scrollable)
      return;
    return (
      <Waypoint onEnter={this.props.loadMore}/>
    );
  };

  renderLoading = () => {
    if (!this.props.loading)
      return;
    return (
      <CircularProgress/>
    );
  };

  renderButton = () => {
    if (this.props.loading || this.props.limit >= this.props.total)
      return;
    return (
      <RaisedButton label="Load more" fullWidth={true} onTouchTap={this.props.loadMore}/>
    );
  };

}

styles = {
  scrollConainer: {
    display: 'flex',
    flex: 1,
    overflowY: 'auto',
  },
};

export default PaginationContainer;