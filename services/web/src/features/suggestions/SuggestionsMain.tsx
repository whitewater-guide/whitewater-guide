import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useAuth } from '@whitewater-guide/clients';
import { SuggestionStatus } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-apollo';
import { Card } from '../../layout';
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

export const SuggestionsMain: React.FC = () => {
  const { me } = useAuth();
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState(
    me && me.admin ? ADMIN_STATUSES : EDITOR_STATUSES,
  );
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

  return (
    <Card loading={loading && !(data && data.suggestions)}>
      <CardHeader title="User suggestions" />
      <CardContent>
        <SuggestionsTableInfinite
          suggestions={data!.suggestions}
          fetchMore={fetchMore}
          onPressResolve={setResolveId}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </CardContent>
      <SuggestionResolveDialog
        suggestionId={resolveId}
        onClose={closeResolveDialog}
      />
    </Card>
  );
};

SuggestionsMain.displayName = 'SuggestionsMain';

export default SuggestionsMain;
