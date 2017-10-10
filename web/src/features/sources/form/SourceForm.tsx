import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import { DraftEditor, Form, Select, TextInput } from '../../../components/forms';
import { WithScriptsList } from '../../../ww-clients/features/scripts';
import { SourceFormInput } from './types';

type Props = WithScriptsList & InjectedFormProps<SourceFormInput>;

export default class SourceForm extends React.PureComponent<Props> {
  render() {
    return (
      <Form {...this.props} resourceType="source">
        <Tabs>
          <Tab label="Main" value="#main">
            <TextInput fullWidth name="name" title="Name" />
            <Select name="script" title="Script" options={this.props.scripts.list} />
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
