import { getListMerger } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { ObservableQueryFields } from 'react-apollo';
import { Index, InfiniteLoader } from 'react-virtualized';

import { QResult, QVars } from './suggestedSections.query';
import SuggestedSectionsTable from './SuggestedSectionsTable';

interface Props {
  suggestedSections: QResult['sections'];
  fetchMore: ObservableQueryFields<QResult, QVars>['fetchMore'];
}

export const SuggestedSectionsInfinite: React.FC<Props> = React.memo(
  (props) => {
    const { suggestedSections, fetchMore } = props;
    const { nodes, count } = suggestedSections;

    const isRowLoaded = useCallback(
      ({ index }: Index) => {
        return !!nodes && !!nodes[index];
      },
      [nodes],
    );

    const loadMore = useCallback(() => {
      return fetchMore({
        variables: {
          page: { offset: nodes ? nodes.length : 0 },
        },
        updateQuery: getListMerger('suggestedSections' as any),
      });
    }, [nodes, fetchMore]);

    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMore}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <SuggestedSectionsTable
            registerChild={registerChild}
            data={nodes || []}
            onRowsRendered={onRowsRendered}
          />
        )}
      </InfiniteLoader>
    );
  },
);

SuggestedSectionsInfinite.displayName = 'SuggestionsTableInfinite';

export default SuggestedSectionsInfinite;
