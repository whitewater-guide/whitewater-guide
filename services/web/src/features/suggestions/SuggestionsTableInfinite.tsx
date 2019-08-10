import { getListMerger } from '@whitewater-guide/clients';
import { SuggestionStatus } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { ObservableQueryFields } from 'react-apollo';
import { Index, InfiniteLoader } from 'react-virtualized';
import { QResult, QVars } from './listSuggestions.query';
import SuggestionsTable from './SuggestionsTable';

interface Props {
  suggestions: QResult['suggestions'];
  fetchMore: ObservableQueryFields<QResult, QVars>['fetchMore'];
  onPressResolve: (id: string) => void;
  statusFilter: SuggestionStatus[];
  setStatusFilter: (value: SuggestionStatus[]) => void;
}

export const SuggestionsTableInfinite: React.FC<Props> = React.memo((props) => {
  const {
    suggestions,
    fetchMore,
    onPressResolve,
    statusFilter,
    setStatusFilter,
  } = props;

  const isRowLoaded = useCallback(
    ({ index }: Index) => {
      const { nodes } = suggestions;
      return !!nodes && !!nodes[index];
    },
    [suggestions.nodes],
  );

  const loadMore = useCallback(() => {
    const { nodes } = suggestions;
    return fetchMore({
      variables: {
        page: { offset: nodes ? nodes.length : 0 },
      },
      updateQuery: getListMerger('suggestions'),
    });
  }, [suggestions, fetchMore]);

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMore}
      rowCount={suggestions.count}
    >
      {({ onRowsRendered, registerChild }) => (
        <SuggestionsTable
          registerChild={registerChild}
          data={suggestions.nodes || []}
          onRowsRendered={onRowsRendered}
          onPressResolve={onPressResolve}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}
    </InfiniteLoader>
  );
});

SuggestionsTableInfinite.displayName = 'SuggestionsTableInfinite';

export default SuggestionsTableInfinite;
