import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Form, PointInput, TextInput } from '../../../components/forms';
import { GaugeInput } from '../../../ww-commons';

export default class GaugeForm extends React.PureComponent<InjectedFormProps<GaugeInput>> {
  render() {
    return (
      <Form {...this.props} resourceType="gauge">
        <div style={{ padding: 8, height: '100%', overflow: 'auto' }}>
          <TextInput fullWidth name="name" title="Name" />
          <TextInput fullWidth name="code" title="Code" />
          <PointInput
            name="location"
            title="Location"
            mapBounds={null}
            paper={false}
            detailed={false}
          />
          <TextInput fullWidth name="levelUnit" title="Level unit" />
          <TextInput fullWidth name="flowUnit" title="Flow unit" />
          <TextInput fullWidth name="requestParams" title="Request params" />
          <TextInput fullWidth name="cron" title="Cron" />
          <TextInput fullWidth name="url" title="URL" />
        </div>
      </Form>
    );
  }
}
