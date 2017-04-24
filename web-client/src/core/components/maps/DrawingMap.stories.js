import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { muiTheme } from 'storybook-addon-material-ui';
import { withState } from 'recompose';
import DrawingMap from './DrawingMap';

const MapContainer = ({ children }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
    { children }
  </div>
);

const ControlledMap = (initialPoints) => withState('points', 'onChange', initialPoints)(DrawingMap);

storiesOf('DrawingMap', module)
  .addDecorator(muiTheme())
  .add('empty point', () => (
    <MapContainer>
      <DrawingMap drawingMode="Point" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing point', () => (
    <MapContainer>
      <DrawingMap drawingMode="Point" points={[[0, 20]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('controlled point', () => {
    const Map = ControlledMap([[0, 20]]);
    return (
      <MapContainer >
        <Map drawingMode="Point" />
      </MapContainer>
    );
  })
  .add('empty polyline', () => (
    <MapContainer>
      <DrawingMap drawingMode="Polyline" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polyline', () => (
    <MapContainer>
      <DrawingMap drawingMode="Polyline" points={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('controlled polyline', () => {
    const Map = ControlledMap([[0, 20], [10, 20], [20, 0]]);
    return (
      <MapContainer >
        <Map drawingMode="Polyline" />
      </MapContainer>
    );
  })
  .add('empty polygon', () => (
    <MapContainer>
      <DrawingMap drawingMode="Polygon" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polygon', () => (
    <MapContainer>
      <DrawingMap drawingMode="Polygon" points={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('controlled polygon', () => {
    const Map = ControlledMap([[0, 20], [10, 20], [20, 0]]);
    return (
      <MapContainer >
        <Map drawingMode="Polygon" />
      </MapContainer>
    );
  })
