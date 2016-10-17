import React, { Component, PropTypes } from 'react';
import { listScripts } from '../../../api/sources';
import { Form, Field, TextInput, Select } from '../../forms';

class SourceForm extends Component {

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

  state = {
    availableScripts: [],
  };

  componentDidMount() {
    listScripts.callPromise()
      .then( availableScripts => this.setState({availableScripts}))
      .catch( err => console.log('List scripts error:', err));
  }

  render() {
    const harvestModes = [
        { value: 'allAtOnce', label: 'All at once' },
        { value: 'oneByOne', label: 'One by one' },
    ];
    const availableScripts = this.state.availableScripts.map(v => ({ value: v, label: v }));
    return (
      <Form {...this.props} name="sources">
        <Field name="name" title="Name" component={TextInput}/>      
        <Field name="script" title="Script" component={Select} options={availableScripts}/>      
        <Field name="url" title="URL" component={TextInput}/>      
        <Field name="harvestMode" title="Harvest Mode" component={Select} options={harvestModes}/>      
        <Field name="cron" title="Cron expression" component={TextInput}/>      
      </Form>      
    );
  }
}

export default SourceForm;