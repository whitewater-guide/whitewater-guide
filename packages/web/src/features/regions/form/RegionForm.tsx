import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import { Tab } from 'material-ui/Tabs';
import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import {
  Checkbox,
  DraftEditor,
  DrawingMapField,
  Form,
  POICollection,
  SeasonPicker,
  TextInput,
} from '../../../components/forms';
import { RegionFormInput } from './types';

export default class RegionForm extends React.PureComponent<InjectedFormProps<RegionFormInput>> {
  render() {
    return (
      <Form {...this.props} resourceType="region">
        <Tabs>
          <Tab label="Main" value="#main">
            <TextInput fullWidth name="name" title="Name" />
            <TextInput fullWidth name="season" title="Season" />
            <SeasonPicker name="seasonNumeric" />
            <Checkbox
              name="hidden"
              label="Visible to users"
              checkedIcon={<VisibilityOff />}
              uncheckedIcon={<Visibility />}
            />
          </Tab>
          <Tab label="Description" value="#description">
            <DraftEditor name="description" />
          </Tab>
          <Tab label="Shape" value="#shape">
            <DrawingMapField name="bounds" drawingMode="Polygon" bounds={null} />
          </Tab>
          <Tab label="POIS" value="#pois">
            <POICollection name="pois" component={POICollection} mapBounds={null} />
          </Tab>
        </Tabs>
      </Form>
    );
  }

}
