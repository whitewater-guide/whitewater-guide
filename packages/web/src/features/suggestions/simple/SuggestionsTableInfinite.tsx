import { ObservableQueryFields } from '@apollo/client';
import { SuggestionStatus } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';
import { Index, InfiniteLoader } from 'react-virtualized';

import {
  ListSuggestionsQuery,
  ListSuggestionsQueryVariables,
} from './listSuggestions.generated';
import SuggestionsTable from './SuggestionsTable';

interface Props {
  suggestions?: ListSuggestionsQuery['suggestions'];
  fetchMore: ObservableQueryFields<
    ListSuggestionsQuery,
    ListSuggestionsQueryVariables
  >['fetchMore'];
  onPressResolve: (id: string) => void;
  statusFilter: SuggestionStatus[];
  setStatusFilter: (value: SuggestionStatus[]) => void;
}

export const SuggestionsTableInfinite = React.memo<Props>((props) => {
  const {
    suggestions,
    fetchMore,
    onPressResolve,
    statusFilter,
    setStatusFilter,
  } = props;
  const nodes = suggestions?.nodes;
  const count = suggestions?.count ?? 0;

  const isRowLoaded = useCallback(
    ({ index }: Index) => !!nodes && !!nodes[index],
    [nodes],
  );

  const loadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          page: { offset: nodes ? nodes.length : 0 },
        },
      }),
    [nodes, fetchMore],
  );

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMore}
      rowCount={count}
    >
      {({ onRowsRendered, registerChild }) => (
        <SuggestionsTable
          registerChild={registerChild}
          data={nodes || []}
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
