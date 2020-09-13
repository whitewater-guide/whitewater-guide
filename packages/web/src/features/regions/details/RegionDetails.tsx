import CardHeader from '@material-ui/core/CardHeader';
import { useRegion } from '@whitewater-guide/clients';
import React from 'react';
import { Route, Switch } from 'react-router';
import useRouter from 'use-react-router';

import { EditorLanguagePicker } from '../../../components/language';
import { Card, CardContent, EditorFooter } from '../../../layout';
import RegionDetailsTabs from './RegionDetailsTabs';

const RegionDetails: React.FC = () => {
  const { node } = useRegion();
  const { match } = useRouter();
  return (
    <Card>
      <CardHeader
        title={node ? node.name : ''}
        action={<EditorLanguagePicker />}
      />

      <CardContent>
        <RegionDetailsTabs />
      </CardContent>

      <Switch>
        <Route exact={true} path={`${match.path}/rivers`}>
          <EditorFooter add={true} />
        </Route>

        <Route exact={true} path={`${match.path}/sections`}>
          <EditorFooter add={true} />
        </Route>

        <Route>
          <EditorFooter edit={true} administrate={true} />
        </Route>
      </Switch>
    </Card>
  );
};

export default RegionDetails;
