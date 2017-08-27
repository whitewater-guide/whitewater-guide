import { CardHeader, CardMedia } from 'material-ui/Card';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import { TextInput } from '../../../components/forms';
import { Content } from '../../../layout/Content';

export default class RegionForm extends React.PureComponent<InjectedFormProps> {

  render() {
    // <Field name="seasonNumeric" component={SeasonPickerField} />
    // <Field name="hidden" title="Hide from users" component={Checkbox} />
    // <Field name="bounds" drawingMode="Polygon" component={DrawingMapField} />
    // <Field name="pois" title="Points of interest" component={POICollection} />
    return (
      <Content card>
        <CardHeader title="Regions list" />
        <CardMedia style={{ height: '100%' }} mediaStyle={{ height: '100%' }}>
          <div style={{ width: '100%', height: '100%' }} >
            <Tabs>
              <Tab label="Main" value="#main">
                <TextInput name="name" title="Name" />
                <TextInput name="season" title="Season" />
              </Tab>
              <Tab label="Description" value="#description">
                <TextInput name="description" title="Description" />
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
