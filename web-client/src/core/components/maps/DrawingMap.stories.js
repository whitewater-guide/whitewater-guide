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
  .add('empty marker', () => (
    <MapContainer>
      <DrawingMap drawingMode="marker" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing marker', () => (
    <MapContainer>
      <DrawingMap drawingMode="marker" points={[[0, 20]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('controlled marker', () => {
    const Map = ControlledMap([[0, 20]]);
    return (
      <MapContainer >
        <Map drawingMode="marker" />
      </MapContainer>
    );
  })
  .add('empty polyline', () => (
    <MapContainer>
      <DrawingMap drawingMode="polyline" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polyline', () => (
    <MapContainer>
      <DrawingMap drawingMode="polyline" points={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('controlled polyline', () => {
    const Map = ControlledMap([[0, 20], [10, 20], [20, 0]]);
    return (
      <MapContainer >
        <Map drawingMode="polyline" />
      </MapContainer>
    );
  })
  .add('empty polygon', () => (
    <MapContainer>
      <DrawingMap drawingMode="polygon" onChange={action('change')} />
    </MapContainer>
  ))
  .add('existing polygon', () => (
    <MapContainer>
      <DrawingMap drawingMode="polygon" points={[[0, 20], [10, 20], [20, 0]]} onChange={action('change')} />
    </MapContainer>
  ))
  .add('controlled polygon', () => {
    const Map = ControlledMap([[0, 20], [10, 20], [20, 0]]);
    return (
      <MapContainer >
        <Map drawingMode="polygon" />
      </MapContainer>
    );
  })
