import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, Select, CoordinatesGroup } from '../../forms';
import { createContainer } from 'meteor/react-meteor-data';
import TextField from 'material-ui/TextField';
import { Meteor} from 'meteor/meteor';
import { Rivers } from '../../../api/rivers';
import { Gauges } from '../../../api/gauges';

class SectionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    regionId: PropTypes.string,
    river: PropTypes.object,
    gauges: PropTypes.array,
    ready: PropTypes.bool,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    if (!this.props.ready)
      return null;
    //Levels missing
    return (
      <Form {...this.props} name="sources">
        <TextField value={this.props.river.name} disabled={true} hintText="River" floatingLabelText="River"
                   style={styles.textInput}/>
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="gaugeId" title="Gauge" component={Select} options={this.props.gauges}/>
        <Field name="putIn" title="Put-in location" component={CoordinatesGroup}/>
        <Field name="takeOut" title="Take-out location" component={CoordinatesGroup}/>
        <Field name="description" title="Description" component={TextInput}/>
        <div style={styles.row}>
          <Field name="length" title="Length, km" component={TextInput} type="number"/>
          <Field name="difficulty" title="Difficulty (I-VI)" component={TextInput} type="number"/>
          <Field name="gradient" title="Gradient, m/km" component={TextInput} type="number"/>
        </div>
        <Field name="season" title="Season" component={TextInput}/>
      </Form>
    );
  }
}

const styles = {
  textInput: {
    width: '100%',
  },
  row: {
    display: 'flex',
  },
};

const SectionFormContainer = createContainer(
  (props) => {
    const sub = Meteor.subscribe('sections.new', props.initialData.riverId);
    const river = Rivers.findOne(props.initialData.riverId);
    //We must follow river->region->sources->gauges chain here
    //It is already chained on server side, we hope that no more gauge subscriptions are active atm
    const gauges = Gauges.find({}).fetch();
    return {
      river,
      gauges,
      ready: sub.ready(),
    }
  },
  SectionForm
);

export default SectionFormContainer;