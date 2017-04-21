import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { muiTheme } from 'storybook-addon-material-ui';
import PolyDrawingMap from './PolyDrawingMap';

const MapContainer = ({ children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
    { children }
  </div>
);

storiesOf('PolyDrawingMap', module)
  .addDecorator(muiTheme())
  .add('empty marker', () => (
    <MapContainer>
      <PolyDrawingMap drawingMode="marker" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing marker', () => (
    <MapContainer>
      <PolyDrawingMap drawingMode="marker" initialPoints={[[0, 20]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('empty polyline', () => (
    <MapContainer>
      <PolyDrawingMap drawingMode="polyline" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polyline', () => (
    <MapContainer>
      <PolyDrawingMap drawingMode="polyline" initialPoints={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('empty polygon', () => (
    <MapContainer>
      <PolyDrawingMap drawingMode="polygon" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polygon', () => (
    <MapContainer>
      <PolyDrawingMap drawingMode="polygon" initialPoints={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ));
