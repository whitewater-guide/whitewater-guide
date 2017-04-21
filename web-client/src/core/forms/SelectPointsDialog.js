import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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
  marker: 1,
  polyline: 2,
  polygon: 3,
};

export class SelectPointsDialog extends React.Component {
  static propTypes = {
    drawingMode: PropTypes.oneOf(['polyline', 'polygon', 'marker']).isRequired,
    initialPoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    bounds: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialPoints: [],
  };

  constructor(props) {
    super(props);
    this.state = { points: [...props.initialPoints] };
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
      <FlatButton primary label="Cancel" onTouchTap={this.onClose} />,
      <FlatButton primary disabled={disabled} label="Submit" onTouchTap={this.onSubmit} />,
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
            initialPoints={this.props.initialPoints}
            bounds={this.props.bounds}
            onChange={this.onChange}
          />
        </div>
      </Dialog>
    );
  }

}
