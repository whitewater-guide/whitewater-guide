import React, {Component, PropTypes} from 'react';
import {Form, Field, TextInput} from '../../core/forms';
import {CoordinatesGroup} from '../points';
import container from './GaugeFormContainer';

class GaugeForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    const {loading, ...props} = this.props;
    if (loading)
      return null;

    return (
      <Form {...props} name="gauges">
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="code" title="Code" component={TextInput}/>
        <Field name="url" title="URL" component={TextInput}/>
        <Field name="location" title="Location" component={CoordinatesGroup}/>
        <Field name="levelUnit" title="Level measurement unit (leave blank if not harvested)" component={TextInput}/>
        <Field name="flowUnit" title="Flow measurement unit (leave blank if not harvested)" component={TextInput}/>
        <Field name="cron" title="Cron expression" component={TextInput}/>
        <Field name="requestParams" title="Additional request params" component={TextInput}/>
      </Form>
    );
  }

}

export default container(GaugeForm);