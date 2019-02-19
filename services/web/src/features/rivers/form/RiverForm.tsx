import { RiverInput } from '@whitewater-guide/commons';
import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Form, StringArrayInput, TextInput } from '../../../components/forms';

export default class RiverForm extends React.PureComponent<
  InjectedFormProps<RiverInput>
> {
  render() {
    return (
      <Form {...this.props} resourceType="river">
        <div style={{ padding: 8, height: '100%', overflow: 'auto' }}>
          <TextInput fullWidth={true} name="name" title="Name" />
          <StringArrayInput name="altNames" title="Alternative names" />
        </div>
      </Form>
    );
  }
}
