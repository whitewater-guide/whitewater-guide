import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Form, StringArrayInput, TextInput } from '../../../components/forms';
import { SectionInput } from '../../../ww-commons';

export default class SectionForm extends React.PureComponent<InjectedFormProps<SectionInput>> {
  render() {
    return (
      <Form {...this.props} resourceType="section">
        <div style={{ padding: 8, height: '100%', overflow: 'auto' }}>
          <TextInput fullWidth name="name" title="Name" />
          <StringArrayInput name="altNames" title="Alternative names"/>
        </div>
      </Form>
    );
  }
}
