import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GMap from '../components/map/GMap';
import Marker from '../components/map/Marker';

export default class SinglePointDialog extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    coordinates: PropTypes.array,
  };

  constructor(props){
    super(props);
    this.state = {
      coordinates: props.coordinates,
      map: null,
      maps: null,
    };
  }

  componentWillUnmount(){
    this.state.maps.event.clearInstanceListeners(this.state.map);
  }

  render() {
    const {coordinates} = this.state;
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
          <GMap onLoaded={this.onLoaded}>
            {coordinates && <Marker coordinates={coordinates} draggable={true} onDragEnd={this.onDrag}/>}
          </GMap>
        </div>
      </Dialog>
    );
  }

  onLoaded = ({map, maps}) => {
    const {coordinates} = this.props;
    if (coordinates) {
      map.setCenter({lat: coordinates[1], lng: coordinates[0]});
      map.setZoom(13);
    }
    else {
      map.addListener('click', this.addMarker);
    }
    this.setState({map, maps});
  };

  addMarker = ({latLng}) => {
    this.setState({coordinates: [latLng.lng(), latLng.lat()]});
    this.state.maps.event.clearInstanceListeners(this.state.map);
  };

  onDrag = (coordinates) => {
    this.setState({coordinates});
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.coordinates);
  };

}

const styles = {
  mapHolder: {
    width: "100%",
    height: 600,
    maxWidth: 'none',
  }
};