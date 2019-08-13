import { useAuth } from '@whitewater-guide/clients';
import { SuggestionStatus } from '@whitewater-guide/commons';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';
import { Loading } from '../../../components';
import {
  LIST_SUGGESTIONS_QUERY,
  QResult,
  QVars,
} from './listSuggestions.query';
import SuggestionResolveDialog from './SuggestionResolveDialog';
import SuggestionsTableInfinite from './SuggestionsTableInfinite';

const ADMIN_STATUSES = [
  SuggestionStatus.PENDING,
  SuggestionStatus.ACCEPTED,
  SuggestionStatus.REJECTED,
];

const EDITOR_STATUSES = [SuggestionStatus.PENDING];

export const SimpleSuggestions: React.FC = () => {
  const { me } = useAuth();
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(
    me && me.admin ? ADMIN_STATUSES : EDITOR_STATUSES,
  );
  useEffect(() => {
    setStatusFilter(me && me.admin ? ADMIN_STATUSES : EDITOR_STATUSES);
  }, [me && me.admin]);
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
