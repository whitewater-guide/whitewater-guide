import { CardActions, CardHeader, CardMedia } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { GatewayDest } from 'react-gateway';
import { InjectedFormProps } from 'redux-form';
import { Tabs } from '../../../components';
import { Checkbox, DraftEditor, POICollection, SeasonPicker, TextInput } from '../../../components/forms';
import { Content } from '../../../layout';
import { Styles } from '../../../styles';
import { DrawingMap } from '../../../components/maps/DrawingMap';

const styles: Styles = {
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gateway: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
};

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
                <DrawingMap drawingMode="Polygon" onChange={() => {}} bounds={null}/>
              </Tab>
              <Tab label="POIS" value="#pois">
                <POICollection name="pois" component={POICollection} />
              </Tab>
            </Tabs>
          </div>
        </CardMedia>
        <CardActions style={styles.actions}>
          <FlatButton label="Create" />
          <div style={styles.gateway}>
            <GatewayDest name="footer" />
          </div>
        </CardActions>
      </Content>
    );
  }

}
