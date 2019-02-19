import { GaugeInput } from '@whitewater-guide/commons';
import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Form, PointInput, TextInput } from '../../../components/forms';

export default class GaugeForm extends React.PureComponent<
  InjectedFormProps<GaugeInput>
> {
  render() {
    return (
      <Form {...this.props} resourceType="gauge">
        <div style={{ padding: 8, height: '100%', overflow: 'auto' }}>
          <TextInput fullWidth={true} name="name" title="Name" />
          <TextInput fullWidth={true} name="code" title="Code" />
          <PointInput
            name="location"
            title="Location"
            mapBounds={null}
            paper={false}
            detailed={false}
          />
          <TextInput fullWidth={true} name="levelUnit" title="Level unit" />
          <TextInput fullWidth={true} name="flowUnit" title="Flow unit" />
          <TextInput
            fullWidth={true}
            name="requestParams"
            title="Request params"
          />
          <TextInput fullWidth={true} name="cron" title="Cron" />
          <TextInput fullWidth={true} name="url" title="URL" />
        </div>
      </Form>
    );
  }
}
