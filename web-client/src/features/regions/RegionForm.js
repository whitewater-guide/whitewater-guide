import React, {Component, PropTypes} from 'react';
import {Form, Field, TextInput, RichTextInput, SeasonPickerField} from '../../core/forms';
import {Tabs, Tab} from 'material-ui/Tabs';
import {POICollection} from "../points";
import container from './RegionFormContainer';

class RegionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
    regionLoading: PropTypes.bool,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    let {regionLoading, ...props} = this.props;
    if (regionLoading)
      return null;

    return (
      <Form {...props} style={styles.form} name="regions">
        <Tabs>
          <Tab label="Main" value="#main">
            <Field name="name" title="Name" component={TextInput}/>
            <Field name="season" title="Season" component={TextInput}/>
            <Field name="seasonNumeric" component={SeasonPickerField}/>
          </Tab>
          <Tab label="Description" value="#description">
            <Field name="description" title="description" component={RichTextInput}/>
          </Tab>
          <Tab label="POIS" value="#pois">
            <Field name="pois" title="Points of interest" component={POICollection}/>
          </Tab>
        </Tabs>
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

export default container(RegionForm);