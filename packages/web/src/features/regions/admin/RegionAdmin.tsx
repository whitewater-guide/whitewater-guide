import { CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { Content, Tabs } from '../../../components';
import { EditorLanguagePicker } from '../../../components/language';
import { CardHeader } from '../../../layout';
import RegionAdminSettingsForm from './settings';

export class RegionAdmin extends React.PureComponent {
  render() {
    return (
      <Content card>
        <CardHeader title="Region administration">
          <EditorLanguagePicker />
        </CardHeader>
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <Tabs>
              <Tab label="Main" value="#main">
                <RegionAdminSettingsForm />
              </Tab>
              <Tab label="Editors" value="#editors">
                <div>Editors</div>
              </Tab>
            </Tabs>
          </div>
        </CardMedia>
      </Content>
    );
  }
}
