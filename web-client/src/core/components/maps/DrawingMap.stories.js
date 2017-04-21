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
  .add('empty marker', () => (
    <MapContainer>
      <DrawingMap drawingMode="marker" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing marker', () => (
    <MapContainer>
      <DrawingMap drawingMode="marker" initialPoints={[[0, 20]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('empty polyline', () => (
    <MapContainer>
      <DrawingMap drawingMode="polyline" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polyline', () => (
    <MapContainer>
      <DrawingMap drawingMode="polyline" initialPoints={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('empty polygon', () => (
    <MapContainer>
      <DrawingMap drawingMode="polygon" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polygon', () => (
    <MapContainer>
      <DrawingMap drawingMode="polygon" initialPoints={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ));
