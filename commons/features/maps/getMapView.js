import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
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
      const selectedSectionView = <SelectedSection {...this.props} />;
      const selectedPOIView = <SelectedPOI {...this.props} />;
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
    withState('selectedSection', 'setSelectedSection', null),
    withState('selectedPOI', 'setSelectedPOI', null),
    withHandlers({
      onSectionSelected: ({ setSelectedPOI, setSelectedSection }) => section => {
        setSelectedSection(section);
        setSelectedPOI(null);
      },
      onPOISelected: ({ setSelectedPOI, setSelectedSection }) => poi => {
        setSelectedPOI(poi);
        setSelectedSection(null);
      }
    })
  )(MapViewBase);
};
