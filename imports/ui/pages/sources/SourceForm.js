import React, {Component, PropTypes} from 'react';
import {Form, Field, TextInput, Select, ChipInput, RichTextInput} from '../../forms';
import {Tabs, Tab} from 'material-ui/Tabs';
import container from './SourceFormContainer';
import _ from 'lodash';

class SourceForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    ready: PropTypes.bool,
    regions: PropTypes.array,
    scripts: PropTypes.array,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    let {regions, ready, scripts, ...props} = this.props;
    if (!ready)
      return null;

    return (
      <Form {...props} style={{minWidth: 400}} transformBeforeSubmit={this.transformBeforeSubmit} name="sources">
        <Tabs>
          <Tab label="Main" value="#main">
            <Field name="name" title="Name" component={TextInput}/>
            <Field name="url" title="URL" component={TextInput}/>
            <Field name="regions" title="Regions" component={ChipInput} options={regions}/>
            <Field name="script" title="Script" component={Select} options={scripts}
                   extractKey={_.property('script')} extractValue={_.property('script')}
                   extractLabel={_.property('script')}/>
            <Field name="cron" title="Cron expression" component={TextInput}/>
          </Tab>
          <Tab label="Terms of use" value="#terms">
            <Field name="termsOfUse" title="Terms of use" component={RichTextInput}/>
          </Tab>
        </Tabs>
      </Form>
    );
  }

  transformBeforeSubmit = (data) => {
    return {
      ...data,
      harvestMode: _.find(this.props.scripts, {script: data.script}).harvestMode,
      regions: data.regions.map(_id => ({ _id })),
    };
  };
}

export default container(SourceForm);