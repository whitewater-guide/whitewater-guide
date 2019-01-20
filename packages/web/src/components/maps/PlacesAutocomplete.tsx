import AutoComplete from 'material-ui/AutoComplete';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { Styles } from '../../styles';
type AutocompletePrediction = google.maps.places.AutocompletePrediction;
type PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
const PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
type PlaceResult = google.maps.places.PlaceResult;

const styles: Styles = {
  container: {
    backgroundColor: 'white',
    width: 300,
  },
};

const alwaysTrue = () => true;

interface SearchResult {
  text: string;
  value: PlaceResult | AutocompletePrediction;
}

interface Props {
  map: google.maps.Map;
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
}

interface State {
  searchText: string;
  autocompleteResult: SearchResult[];
  placesResult: SearchResult[];
}

export default class PlacesAutocomplete extends React.Component<Props, State> {
  autocompleteService: google.maps.places.AutocompleteService;
  placesService: google.maps.places.PlacesService;
  state: State;

  constructor(props: Props) {
    super(props);
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(props.map);
    this.state = {
      searchText: '',
      autocompleteResult: [],
      placesResult: [], // Use both to search by coordinates
    };
  }

  componentDidMount() {
    this.props.map.controls[google.maps.ControlPosition.TOP_LEFT].push(findDOMNode(this) as Element);
  }

  onUpdateInput = (searchText: string) => {
    this.setState({ searchText });
    this.autocompleteService.getPlacePredictions(
      { input: searchText, bounds: this.props.bounds },
      this.onAutocompleteComplete,
    );
    this.placesService.textSearch({ query: searchText, bounds: this.props.bounds }, this.onPlacesComplete);
  };

  onPlacesComplete = (result: PlaceResult[], status: PlacesServiceStatus) => {
    if (status === PlacesServiceStatus.OK) {
      this.setState({
        placesResult: result.map(place => ({ text: place.formatted_address, value: place })),
      });
    }
  };

  onAutocompleteComplete = (result: AutocompletePrediction[], status: PlacesServiceStatus) => {
    if (status === PlacesServiceStatus.OK) {
      this.setState({
        autocompleteResult: result.map(place => ({ text: place.description, value: place })),
      });
    }
  };

  onSelect = (e: any, index: number) => {
    const dataSource = [...this.state.autocompleteResult, ...this.state.placesResult];
    const place = dataSource[index].value;
    if (place.hasOwnProperty('geometry')) {
      this.panZoomTo(place as PlaceResult);
    } else {
      this.placesService.getDetails({ placeId: place.place_id }, this.onDetailsReceived);
    }
  };

  onDetailsReceived = (place: PlaceResult, status: PlacesServiceStatus) => {
    if (status === PlacesServiceStatus.OK) {
      this.panZoomTo(place);
    }
  };

  panZoomTo = (place: PlaceResult) => {
    this.props.map.panTo(place.geometry.location);
    this.props.map.setZoom(11);
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
