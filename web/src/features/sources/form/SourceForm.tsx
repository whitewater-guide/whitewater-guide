import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { Tabs } from '../../../components';
import { ChipInput, DraftEditor, Form, Select, TextInput } from '../../../components/forms';
import { SourceFormProps } from './types';

export default class SourceForm extends React.PureComponent<SourceFormProps> {
  render() {
    return (
      <Form {...this.props} resourceType="source">
        <Tabs>
          <Tab label="Main" value="#main">
            <TextInput fullWidth name="name" title="Name" />
            <ChipInput name="regions" title="Regions" options={this.props.regions} />
            <Select name="script" title="Script" options={this.props.scripts} />
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
