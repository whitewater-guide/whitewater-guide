import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, Select } from '../../forms';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor} from 'meteor/meteor';
import { Regions } from '../../../api/regions';

class SectionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    regionId: PropTypes.string,
    riverId: PropTypes.string,
    rivers: PropTypes.array,
    gauges: PropTypes.array,
    ready: PropTypes.bool,
  };

  render() {
    const regions = this.props.regions.map(region => {
      return {
        value: region._id,
        label: region.name,
    }
    });
    //PutIn
    //TakeOut
    //Levels
    return (
      <Form {...this.props} name="sources">
        <Field name="riverId" title="River" component={Select} options={regions}/>
        <Field name="gaugeId" title="Gauge" component={Select} options={regions}/>
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="description" title="Description" component={TextInput}/>
        <Field name="length" title="Length, km" component={TextInput} type="number"/>
        <Field name="difficulty" title="Difficulty" component={TextInput} type="number"/>
        <Field name="gradient" title="Gradient" component={TextInput} type="number"/>
        <Field name="season" title="Season" component={TextInput}/>
      </Form>
    );
  }
}

const SectionFormContainer = createContainer(
  () => {
    const sub = Meteor.subscribe('regions.list');
    const regions = Regions.find({}).fetch();
    return {
      regions,
      ready: sub.ready(),
    }
  },
  SectionForm
);

export default SectionFormContainer;