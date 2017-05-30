import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { currentScreenSelector } from '../../utils';

class MapLayout extends React.Component {
  static propTypes = {
    mapView: PropTypes.element.isRequired,
    selectedSectionView: PropTypes.element.isRequired,
    selectedPOIView: PropTypes.element.isRequired,
    displayMap: PropTypes.bool.isRequired,
    requestGeolocation: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this._requestGeolocation = props.requestGeolocation;
  }

  shouldRequestGeolocation = () => {
    // Map gets mounted and unmounted while navigation changes, but should request geolocation only once
    const result = this._requestGeolocation;
    this._requestGeolocation = false;
    return result;
  };

  render() {
    const { displayMap } = this.props;
    return (
      <View style={StyleSheet.absoluteFill}>
        { displayMap && cloneElement(this.props.mapView, { requestGeolocation: this.shouldRequestGeolocation() }) }
        { this.props.selectedSectionView }
        { this.props.selectedPOIView }
      </View>
    );
  }
}

// TODO: this causes overlapping maps until https://github.com/airbnb/react-native-maps/issues/1161 gets fixed
// https://github.com/airbnb/react-native-maps/pull/1311 didn't fix it for me
// So the workaround is to render map on it's own screen
export default (displayOnScreen, requestGeolocation = false) => connect(
  state => ({ displayMap: currentScreenSelector(state).routeName === displayOnScreen, requestGeolocation }),
)(MapLayout);
