import CardHeader from '@material-ui/core/CardHeader';
import { useRegion } from '@whitewater-guide/clients';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { EditorLanguagePicker } from '../../../components/language';
import { Card, CardContent, EditorFooter } from '../../../layout';
import RegionDetailsTabs from './RegionDetailsTabs';

const RegionDetails: React.FC = () => {
  const region = useRegion();
  const match = useRouteMatch();
  return (
    <Card>
      <CardHeader
        title={region ? region.name : ''}
        action={<EditorLanguagePicker />}
      />

      <CardContent>
        <RegionDetailsTabs />
      </CardContent>

      <Switch>
        <Route exact path={`${match.path}/rivers`}>
          <EditorFooter add />
        </Route>

        <Route exact path={`${match.path}/sections`}>
          <EditorFooter add />
        </Route>

        <Route>
          <EditorFooter edit administrate />
        </Route>
      </Switch>
    </Card>
  );
};

export default RegionDetails;
