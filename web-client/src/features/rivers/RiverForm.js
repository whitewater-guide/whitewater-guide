import React, {Component, PropTypes} from "react";
import {Form, Field, TextInput, Select} from "../../core/forms";
import container from './RiverFormContainer';

class RiverForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    loading: PropTypes.bool,
    regions: PropTypes.array,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    const {loading, regions, ...props} = this.props;
    if (loading)
      return null;

    return (
      <Form {...props} name="rivers">
        <Field name="regionId" title="Region" component={Select} options={regions}/>
        <Field name="name" title="Name" component={TextInput}/>
        <Field name="description" title="description" component={TextInput}/>
      </Form>
    );
  }
}

export default container(RiverForm);