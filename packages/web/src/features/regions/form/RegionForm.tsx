import React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import {
  DrawingMapField,
  Form,
  FormTab,
  POICollection,
  SeasonPicker,
  TextareaField,
  TextInput,
} from '../../../components/forms';
import { RegionFormInput } from './types';

const MainFields: Array<keyof RegionFormInput> = ['name', 'season', 'seasonNumeric'];
const DescriptionFields: Array<keyof RegionFormInput> = ['description'];
const BoundsFields: Array<keyof RegionFormInput> = ['bounds'];
const PoisFields: Array<keyof RegionFormInput> = ['pois'];

export default class RegionForm extends React.PureComponent<InjectedFormProps<RegionFormInput>> {
  render() {
    return (
      <Form {...this.props} resourceType="region">
        <Tabs>
          <FormTab form="region" fields={MainFields} label="Main" value="#main">
            <TextInput fullWidth name="name" title="Name" />
            <TextInput fullWidth name="season" title="Season" />
            <SeasonPicker name="seasonNumeric" />
          </FormTab>
          <FormTab form="region" fields={DescriptionFields} label="Description" value="#description">
            <TextareaField name="description" />
          </FormTab>
          <FormTab form="region" fields={BoundsFields} label="Shape" value="#shape">
            <DrawingMapField name="bounds" drawingMode="Polygon" bounds={null} />
          </FormTab>
          <FormTab form="region" fields={PoisFields} label="POIS" value="#pois">
            <POICollection name="pois" mapBounds={this.props.initialValues.bounds || null} />
          </FormTab>
        </Tabs>
      </Form>
    );
  }

}
