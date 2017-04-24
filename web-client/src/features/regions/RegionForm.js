import React, { Component } from 'react';
import { Tab } from 'material-ui/Tabs';
import { Form, Field, TextInput, RichTextInput, SeasonPickerField, DrawingMapField } from '../../core/forms';
import { Tabs } from '../../core/components';
import { POICollection } from '../points';
import container from './RegionFormContainer';

class RegionForm extends Component {

  static propTypes = {
    ...Form.propTypes,
  };

  static defaultProps = {
    ...Form.defaultProps,
  };

  render() {
    return (
      <Form {...this.props} fullWidth name="regions">
        <Tabs >
          <Tab label="Main" value="#main">
            <Field name="name" title="Name" component={TextInput} />
            <Field name="season" title="Season" component={TextInput} />
            <Field name="seasonNumeric" component={SeasonPickerField} />
          </Tab>
          <Tab label="Description" value="#description">
            <Field name="description" title="description" component={RichTextInput} />
          </Tab>
          <Tab label="Shape" value="#shape">
            <Field name="bounds" drawingMode="Polygon" component={DrawingMapField} />
          </Tab>
          <Tab label="POIS" value="#pois">
            <Field name="pois" title="Points of interest" component={POICollection} />
          </Tab>
        </Tabs>
      </Form>
    );
  }

}

export default container(RegionForm);
