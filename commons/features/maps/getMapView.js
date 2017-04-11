import React from 'react';
import { compose, withState } from 'recompose';
import { DefaultProps, PropTypes } from './MapBase';

export const getMapView = (Layout, Map, SelectedSection, SelectedPOI) => {
  class MapViewBase extends React.PureComponent {
    static propTypes = {
      ...PropTypes,
    };

    static defaultProps = {
      ...DefaultProps,
    };

    render() {
      const mapView = <Map {...this.props} />;
      const selectedSectionView = <SelectedSection section={this.props.selectedSection} />;
      const selectedPOIView = <SelectedPOI poi={this.props.selectedPOI} />;
      return (
        <Layout
          {...this.props}
          mapView={mapView}
          selectedSectionView={selectedSectionView}
          selectedPOIView={selectedPOIView}
        />
      );
    }
  }

  // Do not use the state, because selected section/poi can be passed from outside,
  // For example, we want to show region map with some section already selected
  return compose(
    withState('selectedSection', 'onSectionSelected', null),
    withState('selectedPOI', 'onPOISelected', null),
  )(MapViewBase);
};
