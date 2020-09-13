import { getListMerger } from '@whitewater-guide/clients';
import {
  Connection,
  NamedNode,
  SectionEditLogEntry,
} from '@whitewater-guide/commons';
import React from 'react';
import { ObservableQueryFields } from 'react-apollo';
import { Index, InfiniteLoader } from 'react-virtualized';

import HistoryTable from './HistoryTable';
import { QResult, QVars } from './query';

interface Props {
  history: Connection<SectionEditLogEntry>;
  user: NamedNode | null;
  onUserChange: (user: NamedNode | null) => void;
  region: NamedNode | null;
  onRegionChange: (user: NamedNode | null) => void;
  fetchMore: ObservableQueryFields<QResult, QVars>['fetchMore'];
  onDiffOpen: (diff: object | null) => void;
}

class HistoryTableInfinite extends React.PureComponent<Props> {
  isRowLoaded = ({ index }: Index) => {
    const { nodes } = this.props.history;
    return !!nodes && !!nodes[index];
  };

  loadMore = () => {
    const {
      fetchMore,
      history: { nodes },
    } = this.props;
    return fetchMore({
      variables: {
        page: { offset: nodes ? nodes.length : 0 },
      },
      updateQuery: getListMerger('history'),
    });
  };

  render() {
    const {
      history,
      user,
      region,
      onUserChange,
      onRegionChange,
      onDiffOpen,
    } = this.props;
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMore}
        rowCount={history.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <HistoryTable
            registerChild={registerChild}
            user={user}
            onUserChange={onUserChange}
            region={region}
            onRowsRendered={onRowsRendered}
            onRegionChange={onRegionChange}
            history={history.nodes || []}
            onDiffOpen={onDiffOpen}
          />
        )}
      </InfiniteLoader>
    );
  }
}

export default HistoryTableInfinite;
