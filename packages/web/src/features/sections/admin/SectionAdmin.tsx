import { CardMedia } from 'material-ui/Card';
import React from 'react';
import { Content } from '../../../components';
import { CardHeader } from '../../../layout';
import SectionAdminSettingsForm from './settings';

export class SectionAdmin extends React.Component {
  render() {
    return (
      <Content card>
        <CardHeader title="Administrate section" />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <SectionAdminSettingsForm />
        </CardMedia>
      </Content>
    );
  }
}
