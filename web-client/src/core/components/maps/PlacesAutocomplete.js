import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import AutoComplete from 'material-ui/AutoComplete';

const styles = {
  container: {
    backgroundColor: 'white',
    width: 300,
  },
};

const alwaysTrue = () => true;

export default class PlacesAutocomplete extends React.Component {
  static propTypes = {
    map: PropTypes.any,
    maps: PropTypes.any,
    bounds: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      autocompleteResult: [],
      placesResult: [], // Use both to search by coordinates
    };
    this.autocompleteService = new props.maps.places.AutocompleteService(props.map);
    this.placesService = new props.maps.places.PlacesService(props.map);
  }

  componentDidMount() {
    const { map, maps } = this.props;
    map.controls[maps.ControlPosition.TOP_LEFT].push(findDOMNode(this));
  }

  onUpdateInput = (searchText) => {
    this.setState({ searchText });
    this.autocompleteService.getPlacePredictions({ input: searchText, bounds: this.props.bounds }, this.onAutocompleteComplete);
    this.placesService.textSearch({ query: searchText, bounds: this.props.bounds }, this.onPlacesComplete);
  };

  onPlacesComplete = (result, status) => {
    if (status === this.props.maps.places.PlacesServiceStatus.OK) {
      this.setState({
        placesResult: result.map(place => ({ text: place.formatted_address, value: place })),
      });
    }
  }

  onAutocompleteComplete = (result, status) => {
    if (status === this.props.maps.places.PlacesServiceStatus.OK) {
      this.setState({
        autocompleteResult: result.map(place => ({ text: place.description, value: place })),
      });
    }
  };

  onSelect = (e, index) => {
    const dataSource = [...this.state.autocompleteResult, ...this.state.placesResult];
    const place = dataSource[index].value;
    if (place.geometry) {
      this.props.map.panTo(place.geometry.location);
    } else {
      this.placesService.getDetails({ placeId: place.place_id }, this.onDetailsReceived);
    }
  };

  onDetailsReceived = (place, status) => {
    if (status === this.props.maps.places.PlacesServiceStatus.OK) {
      this.props.map.panTo(place.geometry.location);
    }
  };

  render() {
    return (
      <div style={styles.container}>
        <AutoComplete
          fullWidth
          hintText="Type anything"
          filter={alwaysTrue}
          dataSource={[...this.state.autocompleteResult, ...this.state.placesResult]}
          onUpdateInput={this.onUpdateInput}
          onNewRequest={this.onSelect}
        />
      </div>
    );
  }
}
