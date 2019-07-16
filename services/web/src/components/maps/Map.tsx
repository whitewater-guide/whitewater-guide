import {
  arrayToGmaps,
  MapProps,
  MapSelectionProvider,
} from '@whitewater-guide/clients';
import { Coordinate, Coordinate3d } from '@whitewater-guide/commons';
import React, { useMemo } from 'react';
import { Styles } from '../../styles';
import GoogleMap, { InitialPosition } from './GoogleMap';
import POIMarker from './POIMarker';
import SectionLine from './SectionLine';
import SelectedPOIWeb from './SelectedPOIWeb';
import SelectedSectionWeb from './SelectedSectionWeb';

const styles: Styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
};

interface Props extends MapProps {
  initialBounds: Coordinate3d[];
  detailed?: boolean;
}

export const Map: React.FC<Props> = React.memo(
  ({ initialBounds, sections, pois, detailed }) => {
    const initialPosition: InitialPosition = useMemo(() => {
      const bounds = new google.maps.LatLngBounds();
      initialBounds.forEach((point: Coordinate) =>
        bounds.extend(arrayToGmaps(point)!),
      );
      return {
        center: bounds.getCenter(),
        bounds,
        zoom: -1,
      };
    }, [initialBounds]);
    return (
      <div style={styles.container}>
        <MapSelectionProvider>
          <GoogleMap initialPosition={initialPosition}>
            {
              sections.map((s) => (
                <SectionLine key={s.id} section={s} detailed={detailed} />
              )) as any
            }
            {pois.map((p) => <POIMarker key={p.id} poi={p} />) as any}
            <SelectedSectionWeb />
            <SelectedPOIWeb />
          </GoogleMap>
        </MapSelectionProvider>
      </div>
    );
  },
);
