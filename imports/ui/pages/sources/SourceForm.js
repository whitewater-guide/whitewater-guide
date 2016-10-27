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
    const availableScripts = this.state.availableScripts.map(v => ({ value: v, label: v }));
    regions = regions.map(region => {
      return {
        value: region._id,
        label: region.name,
      };
    });
    let selectedRegions = _.get(initialData, 'regions', []);//Array os ids
    selectedRegions = _.filter(regions, (region) => _.includes(selectedRegions, region.value));
    initialData = {...initialData, regions: selectedRegions};

    return (
      <Form {...props}
            initialData={initialData}
            transformBeforeSubmit={this.transformBeforeSubmit}
            name="sources"
      >
        <Field name="name" title="Name" component={TextInput}/>      
        <Field name="url" title="URL" component={TextInput}/>
        <Field name="regions" title="Regions" component={ChipInput} options={regions}/>
        <Field name="script" title="Script" component={Select} options={availableScripts}/>
        <Field name="harvestMode" title="Harvest Mode" component={Select} options={harvestModes}/>
        <Field name="cron" title="Cron expression" component={TextInput}/>      
      </Form>      
    );
  }

  transformBeforeSubmit = (data) => {
    return {
      ...data,
      regions: _.map(data.regions, 'value'),
    };
  };
}

const harvestModes = [
  { value: 'allAtOnce', label: 'All at once' },
  { value: 'oneByOne', label: 'One by one' },
];

const SourceFormContainer = createContainer(
  () => {
    const sub = Meteor.subscribe('regions.list');
    const regions = Regions.find({}).fetch();
    return {
      regions,
      ready: sub.ready(),
    }
  },
  SourceForm
);

export default SourceFormContainer;