import { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { Tabs } from '../../../components';
import {
  Checkbox,
  DraftEditor,
  DrawingMapField,
  Form,
  POICollection,
  RatingInput, SeasonPicker,
  Select,
  ShapeInput,
  StringArrayInput,
  TextInput
} from '../../../components/forms';
import { Durations, NamedNode } from '../../../ww-commons';
import { Row } from '../../../layout';
import { Styles } from '../../../styles';
import { SectionFormProps } from './types';

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
Durations.forEach((val, key) => DURATIONS_OPTIONS.push({ id: key as any, name: val, language: 'en' }));

export default class SectionForm extends React.PureComponent<SectionFormProps> {
  render() {
    return (
      <Form {...this.props} resourceType="section">
        <Tabs>
          <Tab label="Main" value="#main">
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
              <Checkbox name="levels.approximate" />
            </Row>
            <Row>
              <TextInput fullWidth name="flows.minimum" type="number" title="Minimal flow" />
              <TextInput fullWidth name="flows.optimum" type="number" title="Optimal flow" />
              <TextInput fullWidth name="flows.maximum" type="number" title="Maximal flow" />
              <TextInput fullWidth name="flows.impossible" type="number" title="Absolute maximum" />
              <Checkbox name="flows.approximate" />
            </Row>
            <TextInput fullWidth name="flowsText" title="Flows description" />
          </Tab>
          <Tab label="Properties" value="#properties">
            <Row>
              <TextInput fullWidth name="drop" type="number" title="Drop, m" />
              <TextInput fullWidth name="distance" type="number" title="Length, km" />
              <Select name="duration" options={DURATIONS_OPTIONS} title="Duration"/>
            </Row>
            <TextInput fullWidth name="season" title="Season" />
            <SeasonPicker name="seasonNumeric" />
          </Tab>
          <Tab label="Shape" value="#shape">
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
          </Tab>
          <Tab label="POIS" value="#pois">
            <POICollection name="pois" component={POICollection} mapBounds={this.props.region.bounds} />
          </Tab>
          <Tab label="Description" value="#description">
            <DraftEditor name="description" />
          </Tab>
        </Tabs>
      </Form>
    );
  }
}
