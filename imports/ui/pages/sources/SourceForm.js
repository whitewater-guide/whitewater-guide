import React, { Component, PropTypes } from 'react';
import { listScripts } from '../../../api/sources';
import { Form, Field, TextInput, Select, ChipInput } from '../../forms';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor} from 'meteor/meteor';
import { Regions } from '../../../api/regions';
import _ from 'lodash';

class SourceForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    ready: PropTypes.bool,
    regions: PropTypes.array,
  };

  static defaultProps = {
    ...Form.defaultProps,
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
    let {initialData, regions, ready, ...props} = this.props;
    if (!ready)
      return null;

    return (
      <Form {...props}
            multilang={false}
            style={{minWidth: 400}}
            initialData={initialData}
            transformBeforeSubmit={this.transformBeforeSubmit}
            name="sources"
      >
        <Field name="name" title="Name" component={TextInput}/>      
        <Field name="url" title="URL" component={TextInput}/>
        <Field name="regionIds" title="Regions" component={ChipInput} options={regions}/>
        <Field name="script" title="Script" component={Select} options={this.state.availableScripts}
               extractKey={_.property('script')} extractValue={_.property('script')} extractLabel={_.property('script')}/>
        <Field name="cron" title="Cron expression" component={TextInput}/>
      </Form>      
    );
  }

  transformBeforeSubmit = (data) => {
    return {
      ...data,
      harvestMode: _.find(this.state.availableScripts, {script: data.script}).harvestMode,
    };
  };
}

const SourceFormContainer = createContainer(
  () => {
    const sub = Meteor.subscribe('regions.list');
    const regions = Regions.find({}, {fields: {name: 1}}).fetch();
    return {
      regions,
      ready: sub.ready(),
    }
  },
  SourceForm
);

export default SourceFormContainer;