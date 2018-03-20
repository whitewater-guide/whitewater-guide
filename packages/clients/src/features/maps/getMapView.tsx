import { find } from 'lodash';
import React from 'react';
import { Point, Section } from '../../../ww-commons';
import { shallowEqual } from '../../utils';
import { MapLayoutProps, MapProps, SelectedPOIViewProps, SelectedSectionViewProps } from './types';

const customizer = (val: any, other: any, key: string) => (key === 'initialBounds' ? true : undefined);

export const getMapView = <M extends MapProps>(
  Layout: React.ComponentType<MapLayoutProps>,
  Body: React.ComponentType<M>,
  SelectedSection: React.ComponentType<SelectedSectionViewProps>,
  SelectedPOI: React.ComponentType<SelectedPOIViewProps>,
): React.ComponentType<M> => {
  class MapViewBase extends React.Component<M> {
    shouldComponentUpdate(nextProps: M) {
      // Initial bounds are initial and should not cause re-rendering
      return !shallowEqual(nextProps, this.props, customizer);
    }

    render() {
      const { selectedSectionId, sections, onSectionSelected, selectedPOIId, pois, onPOISelected } = this.props;
      const mapBody: React.ReactElement<M> = <Body {...this.props} /> as React.ReactElement<M>;
      const selectedSection = find(sections, ({ id }: Section) => id === selectedSectionId) || null;
      const selectedSectionView = (
        <SelectedSection
          key="SelectedSection"
          onSectionSelected={onSectionSelected}
          onPOISelected={onPOISelected}
          selectedSection={selectedSection}
        />
      ) as React.ReactElement<SelectedSectionViewProps>;
      const selectedPOI = find(pois, ({ id }: Point) => id === selectedPOIId) || null;
      const selectedPOIView = (
        <SelectedPOI
          key="SelectedPOI"
          selectedPOI={selectedPOI}
          onPOISelected={onPOISelected}
          selectedSection={selectedSection}
        />
      ) as React.ReactElement<SelectedPOIViewProps>;
      return (
        <Layout
          mapView={mapBody}
          selectedSectionView={selectedSectionView}
          selectedPOIView={selectedPOIView}
        />
      );
    }
  }

  return MapViewBase;
};
