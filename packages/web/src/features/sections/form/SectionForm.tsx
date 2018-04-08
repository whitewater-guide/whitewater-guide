import { groupBy } from 'lodash';
import TextField from 'material-ui/TextField';
import React from 'react';
import { Tabs } from '../../../components';
import {
  Checkbox,
  ChipInput,
  DraftEditor,
  DrawingMapField,
  Form,
  FormTab,
  POICollection,
  RatingInput,
  SeasonPicker,
  Select,
  ShapeInput,
  StringArrayInput,
  TextInput,
} from '../../../components/forms';
import { Row } from '../../../layout';
import { Styles } from '../../../styles';
import { Durations, NamedNode } from '../../../ww-commons';
import { SectionFormInput, SectionFormProps } from './types';

const styles: Styles = {
  container: {
    display: 'flex',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  mapContainer: {
    flex: 1,
  },
  sidebar: {
    width: 270,
    padding: 8,
    overflowY: 'auto',
  },
};

const DURATIONS_OPTIONS: NamedNode[] = [];
Durations.forEach((val, key) => DURATIONS_OPTIONS.push({ id: key as any, name: val }));

const MainFields: Array<keyof SectionFormInput> = [
  'name', 'altNames', 'difficulty', 'difficultyXtra', 'rating', 'gauge', 'levels', 'flows', 'flowsText',
];
const PropertiesFields: Array<keyof SectionFormInput> = [
  'drop', 'distance', 'duration', 'season', 'seasonNumeric', 'supplyTags', 'kayakingTags', 'hazardsTags', 'miscTags',
];
const ShapeFields: Array<keyof SectionFormInput> = ['shape'];
const POIFields: Array<keyof SectionFormInput> = ['pois'];
const DescriptionFields: Array<keyof SectionFormInput> = ['description'];

export default class SectionForm extends React.PureComponent<SectionFormProps> {
  render() {
    const {
      kayaking = [],
      hazards = [],
      supply = [],
      misc = [],
    } = groupBy(this.props.tags, 'category');
    return (
      <Form {...this.props} resourceType="section">
        <Tabs>
          <FormTab form="section" fields={MainFields} label="Main" value="#main">
            <div style={{ overflowX: 'hidden', flex: 1 }}>
              <TextField fullWidth disabled value={this.props.initialValues.river!.name} floatingLabelText="River" />
              <TextInput fullWidth name="name" title="Name" />
              <StringArrayInput name="altNames" title="Alternative names"/>
              <Row>
                <TextInput fullWidth name="difficulty" type="number" title="Difficulty" />
                <TextInput fullWidth name="difficultyXtra" title="Difficulty (extra)" />
                <RatingInput name="rating" title="Rating" />
              </Row>
              <Select simple={false} name="gauge" options={this.props.region.gauges!.nodes!} title="Gauge" />
              <Row>
                <TextInput fullWidth name="levels.minimum" type="number" title="Minimal level" />
                <TextInput fullWidth name="levels.optimum" type="number" title="Optimal level" />
                <TextInput fullWidth name="levels.maximum" type="number" title="Maximal level" />
                <TextInput fullWidth name="levels.impossible" type="number" title="Absolute maximum" />
                <Checkbox name="levels.approximate" label="Approximate" />
              </Row>
              <Row>
                <TextInput fullWidth name="flows.minimum" type="number" title="Minimal flow" />
                <TextInput fullWidth name="flows.optimum" type="number" title="Optimal flow" />
                <TextInput fullWidth name="flows.maximum" type="number" title="Maximal flow" />
                <TextInput fullWidth name="flows.impossible" type="number" title="Absolute maximum" />
                <Checkbox name="flows.approximate" label="Approximate" />
              </Row>
              <TextInput fullWidth name="flowsText" title="Flows description" />
            </div>
          </FormTab>
          <FormTab form="section" fields={PropertiesFields} label="Properties" value="#properties">
            <div style={{ overflowX: 'hidden', flex: 1 }}>
              <Row>
                <TextInput fullWidth name="drop" type="number" title="Drop, m" />
                <TextInput fullWidth name="distance" type="number" title="Length, km" />
                <Select name="duration" options={DURATIONS_OPTIONS} title="Duration"/>
              </Row>
              <TextInput fullWidth name="season" title="Season" />
              <SeasonPicker name="seasonNumeric" />
              <ChipInput name="supplyTags" title="River supply" options={supply} />
              <ChipInput name="kayakingTags" title="Kayaking types" options={kayaking} />
              <ChipInput name="hazardsTags" title="Hazards" options={hazards} />
              <ChipInput name="miscTags" title="Tags" options={misc} />
            </div>
          </FormTab>
          <FormTab form="section" fields={ShapeFields} label="Shape" value="#shape">
            <div style={styles.container}>
              <div style={styles.mapContainer}>
                <div style={{ width: '100%', height: '100%' }}>
                  <DrawingMapField name="shape" drawingMode="LineString" bounds={this.props.region.bounds} />
                </div>
              </div>
              <div style={styles.sidebar}>
                <ShapeInput name="shape" component={ShapeInput} />
              </div>
            </div>
          </FormTab>
          <FormTab form="section" fields={POIFields} label="POIS" value="#pois">
            <POICollection name="pois" component={POICollection} mapBounds={this.props.region.bounds} />
          </FormTab>
          <FormTab form="section" fields={DescriptionFields} label="Description" value="#description">
            <DraftEditor name="description" />
          </FormTab>
        </Tabs>
      </Form>
    );
  }
}
