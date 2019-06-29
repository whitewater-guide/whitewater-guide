import { useRegion } from '@whitewater-guide/clients';
import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { Content, Loading, Tabs } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { CardHeader } from '../../../layout';
import RegionEditorsWithData from './editors';
import RegionGroupsWithData from './groups';
import RegionAdminSettingsForm from './settings';

export const RegionAdmin: React.FC = () => {
  const { node, loading } = useRegion();
  if (loading || !node) {
    return <Loading />;
  }
  return (
    <Content card={true}>
      <CardHeader title={node.name}>
        <EditorLanguagePicker />
      </CardHeader>
      <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <Tabs>
            <Tab label="Main" value="#main">
              <RegionAdminSettingsForm />
            </Tab>
            <Tab label="Editors" value="#editors">
              <RegionEditorsWithData />
            </Tab>
            <Tab label="Groups" value="#groups">
              <RegionGroupsWithData />
            </Tab>
          </Tabs>
        </div>
      </CardMedia>
    </Content>
  );
};
