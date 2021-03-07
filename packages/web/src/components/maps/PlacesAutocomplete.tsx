/* eslint-disable @typescript-eslint/no-redeclare */
import { NamedNode } from '@whitewater-guide/commons';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { Required } from 'utility-types';

import { Autocomplete, AutocompleteFilterOptions } from '../autocomplete';
import { MapElementProps } from './types';

const MENU_PROPS = { disablePortal: true };
const FILTER_OPTIONS: AutocompleteFilterOptions = { matchInput: true };
const styles = {
  container: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 4,
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px',
    borderRadius: 2,
  },
};

interface SearchResult extends NamedNode {
  value:
    | google.maps.places.PlaceResult
    | google.maps.places.AutocompletePrediction;
}

interface State {
  searchText: string;
  combinedResult: SearchResult[];
}

export default class PlacesAutocomplete extends React.Component<
  Required<MapElementProps, 'map'>,
  State
> {
  autocompleteService: google.maps.places.AutocompleteService;
  autocompleteResult: SearchResult[] = [];
  placesService: google.maps.places.PlacesService;
  placesResult: SearchResult[] = [];
  state: State;

  constructor(props: Required<MapElementProps, 'map'>) {
    super(props);
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(props.map);
    this.state = {
      searchText: '',
      combinedResult: [],
    };
  }

  componentDidMount() {
    this.props.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      // eslint-disable-next-line react/no-find-dom-node
      findDOMNode(this) as Element,
    );
  }

  updateSearchResults = () => {
    this.setState({
      combinedResult: uniqBy(
        [...this.autocompleteResult, ...this.placesResult],
        'id',
      ),
    });
  };

  onUpdateInput = debounce((searchText: string) => {
    this.setState({ searchText });
    this.autocompleteService.getPlacePredictions(
      { input: searchText, bounds: this.props.bounds },
      this.onAutocompleteComplete,
    );
    this.placesService.textSearch(
      { query: searchText, bounds: this.props.bounds },
      this.onPlacesComplete,
    );
  }, 250);

  onPlacesComplete = (
    result: google.maps.places.PlaceResult[],
    status: google.maps.places.PlacesServiceStatus,
  ) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.placesResult = result.map((place) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: place.place_id!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: place.formatted_address!,
        value: place,
      }));
      this.updateSearchResults();
    }
  };

  onAutocompleteComplete = (
    result: google.maps.places.AutocompletePrediction[],
    status: google.maps.places.PlacesServiceStatus,
  ) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.autocompleteResult = result.map((place) => ({
        id: place.place_id,
        name: place.description,
        value: place,
      }));
      this.updateSearchResults();
    }
  };

  onSelect = ({ value }: SearchResult) => {
    if ('geometry' in value) {
      this.panZoomTo(value as google.maps.places.PlaceResult);
    } else if (value.place_id) {
      this.placesService.getDetails(
        { placeId: value.place_id },
        this.onDetailsReceived,
      );
    }
    this.setState({ searchText: '' });
  };

  onDetailsReceived = (
    place: google.maps.places.PlaceResult,
    status: google.maps.places.PlacesServiceStatus,
  ) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.panZoomTo(place);
    }
  };

  panZoomTo = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      this.props.map.panTo(place.geometry.location);
      this.props.map.setZoom(11);
    }
  };

  render() {
    return (
      <div style={styles.container}>
        <Autocomplete
          placeholder="Type anything"
          filterOptions={FILTER_OPTIONS}
          options={this.state.combinedResult}
          inputValue={this.state.searchText}
          onInputValueChange={this.onUpdateInput}
          onChange={this.onSelect}
          value={null}
          menuProps={MENU_PROPS}
        />
      </div>
    );
  }
}
