import React from 'react';
import { RouteComponentProps } from 'react-router';
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
import { FormData } from './types';

const MainFields: Array<keyof FormData> = ['name', 'season', 'seasonNumeric'];
const DescriptionFields: Array<keyof FormData> = ['description'];
const BoundsFields: Array<keyof FormData> = ['bounds'];
const PoisFields: Array<keyof FormData> = ['pois'];

type Props = InjectedFormProps<FormData> & RouteComponentProps<any>;

export default class RegionForm extends React.PureComponent<Props> {
  render() {
    const tabTemplateStyle =
      this.props.location.hash === '#description' ? { padding: 0 } : undefined;
    return (
      <Form {...this.props} resourceType="region">
        <Tabs tabTemplateStyle={tabTemplateStyle}>
          <FormTab form="region" fields={MainFields} label="Main" value="#main">
            <TextInput fullWidth={true} name="name" title="Name" />
            <TextInput fullWidth={true} name="season" title="Season" />
            <SeasonPicker name="seasonNumeric" />
          </FormTab>
          <FormTab
            form="region"
            fields={DescriptionFields}
            label="Description"
            value="#description"
          >
            <TextareaField name="description" />
          </FormTab>
          <FormTab
            form="region"
            fields={BoundsFields}
            label="Shape"
            value="#shape"
          >
            <DrawingMapField
              name="bounds"
              drawingMode="Polygon"
              bounds={null}
            />
          </FormTab>
          <FormTab form="region" fields={PoisFields} label="POIS" value="#pois">
            <POICollection
              name="pois"
              mapBounds={this.props.initialValues.bounds || null}
            />
          </FormTab>
        </Tabs>
      </Form>
    );
  }
}
