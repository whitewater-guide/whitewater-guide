import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {DrawingMap} from '../components';
import _ from 'lodash';

export class SelectPointsDialog extends React.Component {
  static propTypes = {
    numPoints: PropTypes.oneOf([1,2]),
    initialPoints: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    bounds: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    numPoints: 1,
    initialPoints: [],
  };

  constructor(props){
    super(props);
    this.state = {
      points: _.cloneDeep(props.initialPoints),
    };
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />,
    ];
    return (
      <Dialog
        title="Choose point"
        actions={actions}
        autoDetectWindowHeight={false}
        autoScrollBodyContent={false}
        modal={false}
        open={true}
        onRequestClose={this.handleClose}
        contentStyle={styles.mapHolder}
        repositionOnUpdate={false}
      >
        <div style={styles.mapHolder}>
          <DrawingMap
            numPoints={this.props.numPoints}
            initialPoints={this.props.initialPoints}
            bounds={this.props.bounds}
            onChange={this.onChange}
          />
        </div>
      </Dialog>
    );
  }

  onChange = (points) => {
    this.setState({points})
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.points);
  };

}

const styles = {
  mapHolder: {
    width: "100%",
    height: 600,
    maxWidth: 'none',
  }
};