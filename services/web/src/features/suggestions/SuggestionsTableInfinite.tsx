import React, { useCallback } from 'react';
import { ObservableQueryFields } from 'react-apollo';
import { Index, InfiniteLoader } from 'react-virtualized';
import { QResult, QVars } from './listSuggestions.query';
import SuggestionsTable from './SuggestionsTable';

interface Props {
  suggestions: QResult['suggestions'];
  fetchMore: ObservableQueryFields<QResult, QVars>['fetchMore'];
}

export const SuggestionsTableInfinite: React.FC<Props> = React.memo((props) => {
  const { suggestions, fetchMore } = props;

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
      updateQuery: (prev: QResult, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          ...prev,
          suggestions: {
            ...prev.suggestions,
            nodes: [
              ...(prev.suggestions.nodes || []),
              ...fetchMoreResult.history.nodes,
            ],
          },
        };
      },
    } as any);
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
        />
      )}
    </InfiniteLoader>
  );
});

SuggestionsTableInfinite.displayName = 'SuggestionsTableInfinite';

export default SuggestionsTableInfinite;
