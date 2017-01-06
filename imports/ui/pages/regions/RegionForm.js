import React, { Component, PropTypes } from 'react';
import { Form, Field, TextInput, RichTextInput } from '../../forms';
import createI18nContainer from '../../hoc/createI18nContainer';
import { Regions } from '../../../api/regions';
import { TAPi18n } from 'meteor/tap:i18n';

class RegionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    regionId: PropTypes.string,
    ready: PropTypes.bool,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    if (!this.props.ready)
      return null;

    return (
      <Form {...this.props} style={styles.form} name="regions">
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="description" title="description" component={RichTextInput}/>
      </Form>
    );
  }
}

const styles = {
  form: {
    width: '100%',
    marginLeft: 24,
    marginRight: 24,
  },
};

const RegionFormContainer = createI18nContainer(
  (props) => {
    const sub = TAPi18n.subscribe('regions.details', props.language, props.regionId);
    const region = Regions.findOne(props.regionId);
    return {
      ready: sub.ready(),
      initialData: region,
    }
  },
  RegionForm
);

export default RegionFormContainer;