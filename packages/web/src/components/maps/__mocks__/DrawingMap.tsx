import { Coordinate, Coordinate3d } from '@whitewater-guide/commons';
import times from 'lodash/times';
import React from 'react';

interface Props {
  points?: Coordinate3d[];
  drawingMode: 'LineString' | 'Polygon' | 'Point';
  bounds: Coordinate[] | null;
  onChange: (points: Coordinate3d[]) => void;
  onLoaded?: (map: google.maps.Map) => void;
}

export class DrawingMap extends React.Component<Props> {
  private _clickCounter = 0;

  onClick = () => {
    this._clickCounter += 1;
    this.props.onChange(times(this._clickCounter).map((i) => [i, i, i]));
  };

  render() {
    return (
      <div
        data-testid="fake_map"
        style={{ width: '100%', height: '100%' }}
        onClick={this.onClick}
      />
    );
  }
}
