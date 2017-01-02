import React, {Component} from 'react';

export default function withPagination(inititalPageSize = 10, pageSize = 10){
  return function (Wrapped) {
    class WrappedWithPagination extends Component {
      state = {
        limit: inititalPageSize,
      };

      render() {
        return (
          <Wrapped
            {...this.props}
            limit={this.state.limit}
            loadMore={this.loadMore}
          />
        )
      }

      loadMore = () => {
        this.setState({limit: this.state.limit + pageSize});
      };
    }

    return WrappedWithPagination;
  }
}