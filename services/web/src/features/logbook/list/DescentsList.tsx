import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React, { useMemo } from 'react';
import { Loading } from '../../../components';
import { Card, EditorFooter } from '../../../layout';
import useMyDescents from './useMyDescents';
import DescentsTable from './DescentsTable';

export const DescentsList: React.FC = () => {
  const { data, loading } = useMyDescents();
  // const removeRegion = useDeleteMutation(REMOVE_REGION, [
  // { query: LIST_REGIONS },
  // ]);
  const descents = useMemo(
    () => data?.myLogbookDescents.edges.map((e) => e.node) || [],
    [data],
  );
  return (
    <Card>
      <CardHeader title="My logbook" />
      <CardContent>
        {loading ? <Loading /> : <DescentsTable descents={descents} />}
      </CardContent>
      <EditorFooter add={true} />
    </Card>
  );
};
