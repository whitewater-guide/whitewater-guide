import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import { DraftEditor, Form, Select, TextInput } from '../../../components/forms';
import { SourceFormInput } from './types';

export default class SourceForm extends React.PureComponent<InjectedFormProps<SourceFormInput>> {
  render() {
    // <Select name="script" floatingLabelText="Script" options=""/>
    return (
      <Form {...this.props} resourceType="source">
        <Tabs>
          <Tab label="Main" value="#main">
            <TextInput fullWidth name="name" title="Name" />
            <TextInput fullWidth name="url" title="URL" />
            <TextInput fullWidth name="cron" title="URL" />
          </Tab>
          <Tab label="Terms Of Use" value="#terms">
            <DraftEditor name="description" />
          </Tab>
        </Tabs>
      </Form>
    );
  }

}
