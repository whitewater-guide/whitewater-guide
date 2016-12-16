import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, Select } from '../../forms';
import createI18nContainer from '../../hoc/createI18nContainer';
import { Regions } from '../../../api/regions';
import { Rivers } from '../../../api/rivers';
import { TAPi18n } from 'meteor/tap:i18n';

class RiverForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    riverId: PropTypes.string,
    regions: PropTypes.array,
    ready: PropTypes.bool,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    if (!this.props.ready)
      return null;

    return (
      <Form {...this.props} name="rivers">
        <Field name="regionId" title="Region" component={Select} options={this.props.regions}/>
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="description" title="description" component={TextInput}/>
      </Form>
    );
  }
}

const RiverFormContainer = createI18nContainer(
  (props) => {
    const sub = TAPi18n.subscribe('rivers.details', props.language, props.riverId);
    const regionsSub = TAPi18n.subscribe('regions.list', props.language);
    const regions = Regions.find({}, {fields: {name: 1}}).fetch();
    const river = props.riverId ? Rivers.findOne(props.riverId) : {};
    return {
      regions,
      initialData: river,
      ready: sub.ready() && regionsSub.ready(),
    }
  },
  RiverForm
);

export default RiverFormContainer;