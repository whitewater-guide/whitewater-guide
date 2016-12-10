import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, CoordinatesGroup } from '../../forms';
import createI18nContainer from '../../hoc/createI18nContainer';
import { TAPi18n } from 'meteor/tap:i18n';
import { Gauges } from '../../../api/gauges';

class GaugeForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    gaugeId: PropTypes.string,
    sourceId: PropTypes.string,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    if (!this.props.ready)
      return null;

    return (
      <Form {...this.props} name="gauges">
        <Field name="name" title="Name" component={TextInput}/>      
        <Field name="code" title="Code" component={TextInput}/>      
        <Field name="url" title="URL" component={TextInput}/>      
        <Field name="location" title="Location" component={CoordinatesGroup}/>
        <Field name="measurement" title="Measured value" component={TextInput}/>
        <Field name="unit" title="Measurement unit" component={TextInput}/>      
        <Field name="cron" title="Cron expression" component={TextInput}/>      
      </Form>      
    );
  }
}

const GaugeFormContainer = createI18nContainer(
  (props) => {
    const sub = TAPi18n.subscribe('gauges.details', props.language, props.gaugeId);
    const gauge = props.gaugeId ? Gauges.findOne(props.gaugeId) : null;
    return {
      initialData: gauge || {sourceId: props.sourceId},
      ready: sub.ready(),
    };
  },
  GaugeForm
);

export default GaugeFormContainer;