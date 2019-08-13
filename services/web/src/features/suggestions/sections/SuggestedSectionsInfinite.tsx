import { getListMerger } from '@whitewater-guide/clients';
import { SuggestionStatus } from '@whitewater-guide/commons';
import React, { useCallback } from 'react';
import { ObservableQueryFields } from 'react-apollo';
import { Index, InfiniteLoader } from 'react-virtualized';
import { QResult, QVars } from './suggestedSections.query';
import SuggestedSectionsTable from './SuggestedSectionsTable';

interface Props {
  suggestedSections: QResult['suggestedSections'];
  fetchMore: ObservableQueryFields<QResult, QVars>['fetchMore'];
  statusFilter: SuggestionStatus[];
  setStatusFilter: (value: SuggestionStatus[]) => void;
}

export const SuggestedSectionsInfinite: React.FC<Props> = React.memo(
  (props) => {
    const {
      suggestedSections,
      fetchMore,
      statusFilter,
      setStatusFilter,
    } = props;

    const isRowLoaded = useCallback(
      ({ index }: Index) => {
        const { nodes } = suggestedSections;
        return !!nodes && !!nodes[index];
      },
      [suggestedSections.nodes],
    );

    const loadMore = useCallback(() => {
      const { nodes } = suggestedSections;
      return fetchMore({
        variables: {
          page: { offset: nodes ? nodes.length : 0 },
        },
        updateQuery: getListMerger('suggestedSections' as any),
      });
    }, [suggestedSections, fetchMore]);

    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMore}
        rowCount={suggestedSections.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <SuggestedSectionsTable
            registerChild={registerChild}
            data={suggestedSections.nodes || []}
            onRowsRendered={onRowsRendered}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
      </InfiniteLoader>
    );
  },
);

SuggestedSectionsInfinite.displayName = 'SuggestionsTableInfinite';

export default SuggestedSectionsInfinite;
