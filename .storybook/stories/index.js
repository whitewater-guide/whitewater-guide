import React from 'react';
import {storiesOf, action, addDecorator} from '@kadira/storybook';
import {muiTheme} from 'storybook-addon-material-ui';
import SeasonPicker from '../../client/core/components/SeasonPicker';
import GoogleMap from '../../client/core/components/maps/GoogleMap';
import DrawingMap from '../../client/core/components/maps/DrawingMap';

storiesOf('SeasonPicker', module)
  .addDecorator(muiTheme())
  .add('empty', () => (
    <SeasonPicker onChange={action('change')}/>
  ))
  .add('with some selections', () => (
    <SeasonPicker value={[2, 13]} onChange={action('change')}/>
  ));

storiesOf('GoogleMap', module)
  .addDecorator(muiTheme())
  .add('basic', () => (
    <GoogleMap/>
  ));


storiesOf('DrawingMap', module)
  .addDecorator(muiTheme())
  .add('single point, empty', () => (
    <div style={{width: 800, height: 600}}>
      <DrawingMap onChange={action('change')}/>
    </div>
  ))
  .add('single point, one point', () => (
    <div style={{width: 800, height: 600}}>
      <DrawingMap initialPoints={[[11, 11]]} onChange={action('change')}/>
    </div>
  ))
  .add('two point, empty', () => (
    <div style={{width: 800, height: 600}}>
      <DrawingMap numPoints={2} onChange={action('change')}/>
    </div>
  ))
  .add('two point, one', () => (
    <div style={{width: 800, height: 600}}>
      <DrawingMap numPoints={2} initialPoints={[[11,22]]} onChange={action('change')}/>
    </div>
  ))
  .add('two point, two', () => (
    <div style={{width: 800, height: 600}}>
      <DrawingMap numPoints={2} initialPoints={[[11,11],[22,22]]} onChange={action('change')}/>
    </div>
  ));