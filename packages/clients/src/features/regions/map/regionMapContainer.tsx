import React from 'react';
import { MapProps } from '../../maps';
import { RegionConsumer } from '../RegionContext';
import { RegionContext } from '../types';
import { RegionMapProps } from './types';

export function regionMapContainer(
  Component: React.ComponentType<MapProps>,
): React.ComponentType<RegionMapProps> {
  const Wrapper: React.StatelessComponent<RegionMapProps> = (props) => (
    <RegionConsumer>
      {(state: RegionContext) => {
        return (
          <Component
            sections={props.sections}
            useSectionShapes={false}
            selectedSectionId={state.selectedSectionId}
            selectedPOIId={state.selectedPOIId}
            pois={props.region.pois}
            initialBounds={props.region.bounds}
            contentBounds={props.region.bounds}
            onSectionSelected={state.onSectionSelected}
            onPOISelected={state.onPOISelected}
          />
        );
      }}
    </RegionConsumer>
  );

  Wrapper.displayName = 'regionMapContainer';

  return Wrapper;
}
