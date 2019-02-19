import { Coordinate, Coordinate3d } from '@whitewater-guide/commons';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { DrawingMap } from './DrawingMap';
import { DrawingMode } from './types';

const styles = {
  contentStyle: {
    width: '90vw',
    height: '100%',
    maxWidth: 'none',
    transform: undefined,
  },
  mapHolder: {
    width: '100%',
    height: 'calc(100vh - 240px)',
    maxWidth: 'none',
  },
};

const MIN_POINTS: { [key in DrawingMode]: number } = {
  Point: 1,
  LineString: 2,
  Polygon: 3,
};

interface Props {
  drawingMode: DrawingMode;
  points?: Coordinate3d[];
  bounds: Coordinate[] | null;
  onClose: () => void;
  onSubmit: (points: Coordinate3d[]) => void;
}

interface State {
  points: Coordinate3d[];
}

export class SelectGeometryDialog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { points: [...(props.points || [])] };
  }

  onChange = (points: Coordinate3d[]) => this.setState({ points });

  onSubmit = () => {
    this.props.onSubmit(this.state.points);
    this.props.onClose();
  };

  render() {
    const disabled =
      this.state.points.length < MIN_POINTS[this.props.drawingMode];
    const actions = [
      <RaisedButton key="cancel" label="Cancel" onClick={this.props.onClose} />,
      <RaisedButton
        primary={true}
        key="submit"
        disabled={disabled}
        label="Submit"
        onClick={this.onSubmit}
      />,
    ];
    return (
      <Dialog
        open={true}
        title={`Choose ${this.props.drawingMode.toLowerCase()}`}
        actions={actions}
        autoDetectWindowHeight={false}
        autoScrollBodyContent={false}
        modal={false}
        onRequestClose={this.props.onClose}
        contentStyle={styles.contentStyle}
        repositionOnUpdate={false}
      >
        <div style={styles.mapHolder}>
          <DrawingMap
            drawingMode={this.props.drawingMode}
            points={this.state.points}
            bounds={this.props.bounds}
            onChange={this.onChange}
          />
        </div>
      </Dialog>
    );
  }
}
