import { SuggestionStatus } from '@whitewater-guide/schema';
import React, { useCallback, useState } from 'react';

import { Loading } from '../../../components';
import { useListSuggestionsQuery } from './listSuggestions.generated';
import SuggestionResolveDialog from './SuggestionResolveDialog';
import SuggestionsTableInfinite from './SuggestionsTableInfinite';

const DEFAULT_STATUSES = [SuggestionStatus.Pending];

export const SimpleSuggestions: React.FC = () => {
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUSES);
  const closeResolveDialog = useCallback(() => {
    setResolveId(null);
  }, [setResolveId]);

  const { data, loading, fetchMore } = useListSuggestionsQuery({
    fetchPolicy: 'network-only',
    variables: {
      filter: { status: statusFilter },
    },
  });

  if (loading && !data?.suggestions) {
    return <Loading />;
  }

  return (
    <>
      <SuggestionsTableInfinite
        suggestions={data?.suggestions}
        fetchMore={fetchMore}
        onPressResolve={setResolveId}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      {resolveId && (
        <SuggestionResolveDialog
          suggestionId={resolveId}
          onClose={closeResolveDialog}
        />
      )}
    </>
  );
};

SimpleSuggestions.displayName = 'SimpleSuggestions';
