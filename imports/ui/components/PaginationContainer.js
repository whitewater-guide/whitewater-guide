import React, {Component, PropTypes} from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

class PaginationContainer extends Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    loadMore: PropTypes.func.isRequired,
    style: PropTypes.any,
  };

  render() {
    return (
      <div style={this.props.style}>
        {this.props.children}
        {this.renderLoading()}
        {this.renderButton()}
      </div>
    );
  }

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

export default PaginationContainer;