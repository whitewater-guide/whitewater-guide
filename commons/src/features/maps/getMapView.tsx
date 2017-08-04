import React from 'react';
import { find } from 'lodash';
import shallowequal from 'shallowequal';
import { DefaultProps, PropTypes } from './MapBase';

const customizer = (val, other, key) => (key === 'initialBounds' ? true : undefined);

export const getMapView = (Layout, Map, SelectedSection, SelectedPOI) => {
  class MapViewBase extends React.Component {
    static propTypes = {
      ...PropTypes,
    };

    static defaultProps = {
      ...DefaultProps,
    };

    shouldComponentUpdate(nextProps) {
      // Initial bounds are initial and should not cause re-rendering
      return !shallowequal(nextProps, this.props, customizer);
    }

    render() {
      const { selectedSectionId, sections, onSectionSelected, selectedPOIId, pois, onPOISelected } = this.props;
      const mapView = <Map {...this.props} />;
      const selectedSection = find(sections, { _id: selectedSectionId });
      const selectedSectionView = (
        <SelectedSection
          onSectionSelected={onSectionSelected}
          onPOISelected={onPOISelected}
          selectedSection={selectedSection}
        />
      );
      const selectedPOI = find(pois, { _id: selectedPOIId });
      const selectedPOIView = (
        <SelectedPOI
          selectedPOI={selectedPOI}
          onPOISelected={onPOISelected}
          selectedSection={selectedSection}
        />
      );
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
