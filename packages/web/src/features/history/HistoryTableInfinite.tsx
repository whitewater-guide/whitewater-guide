import { NamedNode } from '@whitewater-guide/schema';
import React from 'react';
import { Index } from 'react-virtualized';

import { InfiniteLoader } from '../../components';
import HistoryTable from './HistoryTable';
import {
  SectionsEditLogQuery,
  SectionsEditLogQueryResult,
} from './sectionsEditLog.generated';
import { Diff } from './types';

interface Props {
  history: SectionsEditLogQuery['history'];
  user: NamedNode | null;
  onUserChange: (user: NamedNode | null) => void;
  region: NamedNode | null;
  onRegionChange: (user: NamedNode | null) => void;
  fetchMore: SectionsEditLogQueryResult['fetchMore'];
  onDiffOpen: (diff: Diff | null) => void;
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
    });
  };

  render() {
    const { history, user, region, onUserChange, onRegionChange, onDiffOpen } =
      this.props;
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
