import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React, { useMemo } from 'react';
import { useQuery } from 'react-apollo';
import useRouter from 'use-react-router';
import { useDeleteMutation } from '../../../apollo';
import { EditorLanguagePicker } from '../../../components';
import { squashConnection } from '../../../formik/utils';
import { Card, EditorFooter } from '../../../layout';
import { LIST_SOURCES, QResult } from './listSources.query';
import { REMOVE_SOURCE } from './removeSource.mutation';
import SourcesTable from './SourcesTable';
import useToggleSource from './useToggleSource';

export const SourcesList: React.FC = React.memo((props) => {
  const { history } = useRouter();
  const { data, loading } = useQuery<QResult>(LIST_SOURCES, {
    fetchPolicy: 'cache-and-network',
  });
  const removeSource = useDeleteMutation(REMOVE_SOURCE, [
    { query: LIST_SOURCES },
  ]);
  const toggleSource = useToggleSource();
  const sources = useMemo(() => squashConnection(data, 'sources'), [data]);
  return (
    <Card loading={loading && sources.length === 0}>
      <CardHeader title="Sources list" action={<EditorLanguagePicker />} />
      <CardContent>
        <SourcesTable
          sources={sources}
          onRemove={removeSource}
          onToggle={toggleSource}
          history={history}
        />
      </CardContent>
      <EditorFooter add={true} />
    </Card>
  );
});

SourcesList.displayName = 'SourcesList';
