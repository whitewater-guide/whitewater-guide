import { SuggestionStatus } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-apollo';
import { Loading } from '../../../components';
import {
  LIST_SUGGESTIONS_QUERY,
  QResult,
  QVars,
} from './listSuggestions.query';
import SuggestionResolveDialog from './SuggestionResolveDialog';
import SuggestionsTableInfinite from './SuggestionsTableInfinite';

const DEFAULT_STATUSES = [SuggestionStatus.PENDING];

export const SimpleSuggestions: React.FC = () => {
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUSES);
  const closeResolveDialog = useCallback(() => {
    setResolveId(null);
  }, [setResolveId]);

  const { data, loading, fetchMore } = useQuery<QResult, QVars>(
    LIST_SUGGESTIONS_QUERY,
    {
      fetchPolicy: 'network-only',
      variables: {
        filter: { status: statusFilter },
      },
    },
  );

  if (loading && !(data && data.suggestions)) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <SuggestionsTableInfinite
        suggestions={data!.suggestions}
        fetchMore={fetchMore}
        onPressResolve={setResolveId}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <SuggestionResolveDialog
        suggestionId={resolveId}
        onClose={closeResolveDialog}
      />
    </React.Fragment>
  );
};

SimpleSuggestions.displayName = 'SimpleSuggestions';
