import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { Content, Tabs } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { CardHeader } from '../../../layout';
import { RegionConsumer } from '../../../ww-clients/features/regions';
import RegionEditorsWithData from './editors';
import RegionGroupsWithData from './groups';
import RegionAdminSettingsForm from './settings';

export class RegionAdmin extends React.Component {
  render() {
    return (
      <Content card>
        <RegionConsumer>
          {({ region }) => (
            <CardHeader title={region.node!.name}>
              <EditorLanguagePicker />
            </CardHeader>
          )}
        </RegionConsumer>
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
  }
}
