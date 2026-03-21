import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import { useHistory } from 'react-router';

import { useDeleteMutation } from '../../../apollo';
import { EditorLanguagePicker } from '../../../components';
import { Card, EditorFooter } from '../../../layout';
import {
  ListSourcesDocument,
  useListSourcesQuery,
} from './listSources.generated';
import { RemoveSourceDocument } from './removeSource.generated';
import SourcesTable from './SourcesTable';
import useToggleSource from './useToggleSource';

export const SourcesList: React.FC = React.memo(() => {
  const history = useHistory();
  const { data, loading } = useListSourcesQuery({
    fetchPolicy: 'cache-and-network',
  });
  const removeSource = useDeleteMutation(RemoveSourceDocument, [
    { query: ListSourcesDocument },
  ]);
  const toggleSource = useToggleSource();
  return (
    <Card loading={loading && !data}>
      <CardHeader title="Sources list" action={<EditorLanguagePicker />} />
      <CardContent>
        <SourcesTable
          sources={data?.sources.nodes}
          onRemove={removeSource}
          onToggle={toggleSource}
          history={history}
        />
      </CardContent>
      <EditorFooter add />
    </Card>
  );
});

SourcesList.displayName = 'SourcesList';
