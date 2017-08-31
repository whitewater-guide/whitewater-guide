import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import {
  Checkbox,
  DraftEditor,
  DrawingMapField,
  POICollection,
  SeasonPicker,
  TextInput,
} from '../../../components/forms';
import { Content } from '../../../layout';

export default class RegionForm extends React.PureComponent<InjectedFormProps> {

  render() {
    return (
      <Content card>
        <CardHeader title="Regions list" />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }}>
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
          </div>
        </CardMedia>
        <CardActions>
          <FlatButton label="Create" onClick={this.props.handleSubmit} />
        </CardActions>
      </Content>
    );
  }

}
