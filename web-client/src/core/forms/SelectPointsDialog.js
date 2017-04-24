import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { DrawingMap } from '../components';

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

const minPoints = {
  Point: 1,
  Polyline: 2,
  Polygon: 3,
};

export class SelectPointsDialog extends React.Component {
  static propTypes = {
    drawingMode: PropTypes.oneOf(['Polyline', 'Polygon', 'Point']).isRequired,
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialPoints: [],
  };

  constructor(props) {
    super(props);
    this.state = { points: [...(props.points || [])] };
  }

  onChange = (points) => {
    this.setState({ points });
  };

  onClose = () => {
    this.props.onClose();
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.points);
  };

  render() {
    const disabled = this.state.points.length < minPoints[this.props.drawingMode];
    const actions = [
      <RaisedButton label="Cancel" onTouchTap={this.onClose} />,
      <RaisedButton primary disabled={disabled} label="Submit" onTouchTap={this.onSubmit} />,
    ];
    return (
      <Dialog
        open
        title="Choose point"
        actions={actions}
        autoDetectWindowHeight={false}
        autoScrollBodyContent={false}
        modal={false}
        onRequestClose={this.handleClose}
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
