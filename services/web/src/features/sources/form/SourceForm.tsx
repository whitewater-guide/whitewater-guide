import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { Tabs } from '../../../components';
import {
  ChipInput,
  Form,
  Select,
  TextareaField,
  TextInput,
} from '../../../components/forms';
import { SourceFormProps } from './types';

export default class SourceForm extends React.PureComponent<SourceFormProps> {
  render() {
    const tabTemplateStyle =
      this.props.location.hash === '#terms' ? { padding: 0 } : undefined;
    return (
      <Form {...this.props} resourceType="source">
        <Tabs tabTemplateStyle={tabTemplateStyle}>
          <Tab label="Main" value="#main">
            <TextInput fullWidth={true} name="name" title="Name" />
            <ChipInput
              name="regions"
              title="Regions"
              options={this.props.regions}
            />
            <Select
              simple={false}
              name="script"
              title="Script"
              options={this.props.scripts}
            />
            <TextInput fullWidth={true} name="url" title="URL" />
            <TextInput
              fullWidth={true}
              name="requestParams"
              title="Request params"
            />
            <TextInput fullWidth={true} name="cron" title="Cron" />
          </Tab>
          <Tab label="Terms Of Use" value="#terms">
            <TextareaField name="termsOfUse" />
          </Tab>
        </Tabs>
      </Form>
    );
  }
}
