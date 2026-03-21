import Box from '@material-ui/core/Box';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import type { MapProps } from '@whitewater-guide/clients';
import { MapSelectionProvider } from '@whitewater-guide/clients';
import React from 'react';

import type { GoogleMapControlProps } from './GoogleMap';
import GoogleMap from './GoogleMap';
import MapLoader from './MapLoader';
import POIMarker from './POIMarker';
import SectionLine from './SectionLine';
import SelectedPOIWeb from './SelectedPOIWeb';
import SelectedSectionWeb from './SelectedSectionWeb';
import useInitialPosition from './useInitialPosition';

const useStyles = makeStyles(() =>
  createStyles({
    mapRoot: {
      '& .gm-style-iw': {
        paddingLeft: undefined,
        paddingBottom: undefined,
        maxWidth: 'auto !important',
        maxHeight: 'auto !important',
        '& div': {
          overflow: 'hidden',
        },
      },
    },
  }),
);

interface Props extends MapProps {
  /**
   * Initial bounds of the map.
   * Usually bounds of region or shape of river
   */
  initialBounds: CodegenCoordinates[];
  /**
   * When this key is set, position for map with this key will be remembered during user session.
   * For example, when user navigates from region map to section details and then back to region map
   * If not set, map will always start at initialBounds
   */
  saveBoundsKey?: string;
  /**
   * Whether to draw section shape or just line from put-in to take-out
   */
  detailed?: boolean;
  /**
   * Map controls
   */
  controls?: Array<React.ReactElement<GoogleMapControlProps>>;
}

const MapInternal = React.memo<Props>(
  ({ initialBounds, saveBoundsKey, sections, pois, detailed, controls }) => {
    const classes = useStyles();

    const positionProps = useInitialPosition(initialBounds, saveBoundsKey);

    return (
      <Box width={1} height={1} className={classes.mapRoot}>
        <MapSelectionProvider>
          <GoogleMap controls={controls} {...positionProps}>
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
      </Box>
    );
  },
);

MapInternal.displayName = 'MapInternal';

export const Map: React.FC<Props> = (props) => (
  <MapLoader>
    <MapInternal {...props} />
  </MapLoader>
);
