import type { ObservableQueryFields } from '@apollo/client';
import React, { useCallback } from 'react';
import type { Index } from 'react-virtualized';

import { InfiniteLoader } from '../../../components';
import type {
  SuggestedSectionsQuery,
  SuggestedSectionsQueryVariables,
} from './suggestedSections.generated';
import SuggestedSectionsTable from './SuggestedSectionsTable';

interface Props {
  suggestedSections?: SuggestedSectionsQuery['sections'];
  fetchMore: ObservableQueryFields<
    SuggestedSectionsQuery,
    SuggestedSectionsQueryVariables
  >['fetchMore'];
}

export const SuggestedSectionsInfinite = React.memo<Props>((props) => {
  const { suggestedSections, fetchMore } = props;
  const nodes = suggestedSections?.nodes;
  const count = suggestedSections?.count ?? 0;

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
        <SuggestedSectionsTable
          registerChild={registerChild}
          data={nodes || []}
          onRowsRendered={onRowsRendered}
        />
      )}
    </InfiniteLoader>
  );
});

SuggestedSectionsInfinite.displayName = 'SuggestionsTableInfinite';

export default SuggestedSectionsInfinite;
