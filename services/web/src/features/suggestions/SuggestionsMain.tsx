import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import { useQuery } from 'react-apollo';
import { Card } from '../../layout';
import {
  LIST_SUGGESTIONS_QUERY,
  QResult,
  QVars,
} from './listSuggestions.query';
import SuggestionsTableInfinite from './SuggestionsTableInfinite';

export const SuggestionsMain: React.FC = () => {
  const { data, loading, fetchMore } = useQuery<QResult, QVars>(
    LIST_SUGGESTIONS_QUERY,
    {
      fetchPolicy: 'network-only',
    },
  );
  return (
    <Card loading={loading && !(data && data.suggestions)}>
      <CardHeader title="User suggestions" />
      <CardContent>
        <SuggestionsTableInfinite
          suggestions={data!.suggestions}
          fetchMore={fetchMore}
        />
      </CardContent>
    </Card>
  );
};

SuggestionsMain.displayName = 'SuggestionsMain';

export default SuggestionsMain;
