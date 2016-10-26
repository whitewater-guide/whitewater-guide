import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, Select } from '../../forms';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor} from 'meteor/meteor';
import { Regions } from '../../../api/regions';

class RiverForm extends Component {

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
    regions: PropTypes.array,
    ready: PropTypes.bool,
  };

  render() {
    const regions = this.props.regions.map(region => {
      return {
        value: region._id,
        label: region.name,
      }
    });
    return (
      <Form {...this.props} name="sources">
        <Field name="regionId" title="Region" component={Select} options={regions}/>
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="description" title="description" component={TextInput}/>
      </Form>
    );
  }
}

const RiverFormContainer = createContainer(
  () => {
    const sub = Meteor.subscribe('regions.list');
    const regions = Regions.find({}).fetch();
    return {
      regions,
      ready: sub.ready(),
    }
  },
  RiverForm
);

export default RiverFormContainer;