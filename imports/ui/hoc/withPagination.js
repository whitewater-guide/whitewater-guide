import React, {Component} from 'react';
import {SortDirection} from 'react-virtualized';

export default function withPagination(inititalPageSize = 10, pageSize = 10, defaultSort = 'name'){
  return function (Wrapped) {
    class WrappedWithPagination extends Component {
      state = {
        limit: inititalPageSize,
        sortBy: defaultSort,
        sortDirection: SortDirection.ASC,
      };

      render() {
        return (
          <Wrapped
            {...this.props}
            limit={this.state.limit}
            loadMore={this.loadMore}
            sortBy={this.state.sortBy}
            sortDirection={this.state.sortDirection}
            onSort={this.onSort}
          />
        )
      }

      loadMore = () => {
        this.setState({limit: this.state.limit + pageSize});
      };

      onSort = ({sortBy, sortDirection}) => {
        this.setState({sortBy, sortDirection});
      };

    }

    return WrappedWithPagination;
  }
}