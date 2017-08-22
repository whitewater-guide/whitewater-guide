import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tab } from 'material-ui/Tabs';
import _ from 'lodash';
import { Form, Field, TextInput, Select, ChipInput, RichTextInput } from '../../core/forms';
import { Tabs } from '../../core/components';
import container from './SourceFormContainer';

class SourceForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    loading: PropTypes.bool,
    regions: PropTypes.array,
    scripts: PropTypes.array,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  transformBeforeSubmit = data => ({
    ...data,
    harvestMode: _.find(this.props.scripts, { script: data.script }).harvestMode,
  });

  render() {
    const { regions, loading, scripts, ...props } = this.props;
    if (loading)
      return null;

    return (
      <Form {...props} fullWidth transformBeforeSubmit={this.transformBeforeSubmit} name="sources">
        <Tabs>
          <Tab label="Main" value="#main">
            <Field name="name" title="Name" component={TextInput} />
            <Field name="url" title="URL" component={TextInput} />
            <Field name="regions" title="Regions" component={ChipInput} options={regions} />
            <Field name="script" title="Script" component={Select} options={scripts}
                   extractKey={_.property('script')} extractValue={_.property('script')}
                   extractLabel={_.property('script')} />
            <Field name="cron" title="Cron expression" component={TextInput} />
          </Tab>
          <Tab label="Terms of use" value="#terms">
            <Field name="termsOfUse" title="Terms of use" component={RichTextInput} />
          </Tab>
        </Tabs>
      </Form>
    );
  }

}

export default container(SourceForm);
