import { CardHeader, CardMedia } from 'material-ui/Card';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import { Checkbox, DraftEditor, SeasonPicker, TextInput } from '../../../components/forms';
import { Content } from '../../../layout/Content';

export default class RegionForm extends React.PureComponent<InjectedFormProps> {

  render() {
    // <Field name="bounds" drawingMode="Polygon" component={DrawingMapField} />
    // <Field name="pois" title="Points of interest" component={POICollection} />
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
                <TextInput name="bounds" title="Bounds" />
              </Tab>
              <Tab label="POIS" value="#pois">
                <TextInput name="pois" title="POIS" />
              </Tab>
            </Tabs>
          </div>
        </CardMedia>
      </Content>
    );
  }

}
