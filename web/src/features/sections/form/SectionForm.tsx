import { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import { Tabs } from '../../../components';
import {
  DraftEditor,
  DrawingMapField,
  Form,
  POICollection,
  ShapeInput,
  StringArrayInput,
  TextInput
} from '../../../components/forms';
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

export default class SectionForm extends React.PureComponent<SectionFormProps> {
  render() {
    return (
      <Form {...this.props} resourceType="section">
        <Tabs>
          <Tab label="Main" value="#main">
            <TextField fullWidth disabled value={this.props.initialValues.river!.name} floatingLabelText="River" />
            <TextInput fullWidth name="name" title="Name" />
            <StringArrayInput name="altNames" title="Alternative names"/>
          </Tab>
          <Tab label="Description" value="#description">
            <DraftEditor name="description" />
          </Tab>
          <Tab label="Shape" value="#shape">
            <div style={styles.container}>
              <div style={styles.mapContainer}>
                <div style={{ width: '100%', height: '100%' }}>
                  <DrawingMapField name="shape" drawingMode="LineString" bounds={null} />
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
        </Tabs>
      </Form>
    );
  }
}
