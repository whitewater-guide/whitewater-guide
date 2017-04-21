import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { muiTheme } from 'storybook-addon-material-ui';
import DrawingMap from './DrawingMap';

const MapContainer = ({ children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
    { children }
  </div>
);

storiesOf('DrawingMap', module)
  .addDecorator(muiTheme())
  .add('single point, empty', () => (
    <MapContainer>
      <DrawingMap onChange={action('change')} />
    </MapContainer>
  ))
  .add('single point, one point', () => (
    <MapContainer>
      <DrawingMap initialPoints={[[11, 11]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('two point, empty', () => (
    <MapContainer>
      <DrawingMap numPoints={2} onChange={action('change')} />
    </MapContainer>
  ))
  .add('two point, one', () => (
    <MapContainer>
      <DrawingMap numPoints={2} initialPoints={[[11, 22]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('two point, two', () => (
    <MapContainer>
      <DrawingMap numPoints={2} initialPoints={[[11, 11], [22, 22]]} onChange={action('change')} />
    </MapContainer>
  ));
