import { useRegion } from '@whitewater-guide/clients';
import { CardMedia } from 'material-ui/Card';
import React from 'react';
import { Route, Switch } from 'react-router';
import useRouter from 'use-react-router';
import { Content } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { CardHeader, EditorFooter } from '../../../layout';
import RegionDetailsTabs from './RegionDetailsTabs';

const RegionDetails: React.FC = () => {
  const { node } = useRegion();
  const { match } = useRouter();
  return (
    <Content card={true}>
      <CardHeader title={node ? node.name : ''}>
        <EditorLanguagePicker />
      </CardHeader>

      <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <RegionDetailsTabs />
        </div>
      </CardMedia>

      <Switch>
        <Route exact={true} path={`${match.path}/rivers`}>
          <EditorFooter add={true} />
        </Route>

        <Route exact={true} path={`${match.path}/sections`} />

        <Route>
          <EditorFooter edit={true} administrate={true} />
        </Route>
      </Switch>
    </Content>
  );
};

export default RegionDetails;
