import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput } from '../../forms';

class GaugeForm extends Component {

  static propTypes = {
    title: PropTypes.string,
    method: PropTypes.shape({
      call: PropTypes.func,
      callPromise: PropTypes.func,
    }).isRequired,
    cancelLabel: PropTypes.string,
    submitLabel: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    initialData: PropTypes.object,
  };

  render() {
    return (
      <Form {...this.props} name="sources">
        <Field name="name" title="Name" component={TextInput}/>      
        <Field name="code" title="Code" component={TextInput}/>      
        <Field name="url" title="URL" component={TextInput}/>      
        <Field name="altitude" title="Altitude" component={TextInput}/>      
        <Field name="latitude" title="Latitude" component={TextInput}/>      
        <Field name="longitude" title="Longitude" component={TextInput}/>      
        <Field name="measurement" title="Measured value" component={TextInput}/>      
        <Field name="unit" title="Measurement unit" component={TextInput}/>      
        <Field name="cron" title="Cron expression" component={TextInput}/>      
      </Form>      
    );
  }
}

export default GaugeForm;