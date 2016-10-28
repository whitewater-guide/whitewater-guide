import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, Select } from '../../forms';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor} from 'meteor/meteor';
import { Regions } from '../../../api/regions';

class RiverForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    initialData: PropTypes.object,
    regions: PropTypes.array,
    ready: PropTypes.bool,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    return (
      <Form {...this.props} name="sources">
        <Field name="regionId" title="Region" component={Select} options={this.props.regions}/>
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="description" title="description" component={TextInput}/>
      </Form>
    );
  }
}

const RiverFormContainer = createContainer(
  () => {
    //TODO: we dont need subscriptions here
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