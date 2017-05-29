import React from 'react';
import { find } from 'lodash';
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
      const { selectedSectionId, sections, selectedPOIId, pois } = this.props;
      const mapView = <Map {...this.props} />;
      const selectedSection = find(sections, { _id: selectedSectionId });
      const selectedSectionView = <SelectedSection {...this.props} selectedSection={selectedSection} />;
      const selectedPOI = find(pois, { _id: selectedPOIId });
      const selectedPOIView = <SelectedPOI {...this.props} selectedPOI={selectedPOI} />;
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

  return MapViewBase;
};
