import Mapbox, { RegionChangeEvent } from '@react-native-mapbox-gl/maps';
import { CoordinateLoose, SectionInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import useBoolean from 'react-use/lib/useBoolean';

import { MapLayoutBase } from '~/components/map';

import theme from '../../../theme';
import { useAddSectionRegion } from '../context';
import { PiToDialog } from './dialog';
import PiToControl from './PiToControl';
import PiToMap from './PiToMap';
import PiToOverlay from './PiToOverlay';
import { usePiToState } from './usePiToState';

const styles = StyleSheet.create({
  controls: {
    height: 64,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  mapWrapper: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 64 - 28,
    left: theme.screenWidth / 2 - 28,
  },
});

const WORLD_BOUNDS: CoordinateLoose[] = [
  [-179, -89],
  [-179, 89],
  [179, 89],
  [179, -89],
];

const PiToField: React.FC = React.memo(() => {
  const region = useAddSectionRegion();
  const cameraRef = useRef<Mapbox.Camera | null>(null);
  const { values, setFieldValue, setFieldTouched } = useFormikContext<
    SectionInput
  >();
  const { state, mapRef, move, select, set } = usePiToState(values.shape);
  const shapeRef = useRef(state.shape);
  shapeRef.current = state.shape;
  const [moving, setMoving] = useState(false);
  const handlers = useMemo(
    () => ({
      onRegionWillChange: () => {
        setMoving(true);
      },
      // onRegionIsChanging: (e: RegionChangeEvent) => {
      //   move(e.geometry.coordinates as any);
      // },
      onRegionDidChange: (e: RegionChangeEvent) => {
        move(e.geometry.coordinates as any);
        setMoving(false);
      },
      onPress: () => select(-1),
    }),
    [move, select, setMoving],
  );

  const [dialogOpen, toggleDialog] = useBoolean(false);

  // This effect re-centers map when other point (if it exists) is selected again
  useEffect(() => {
    if (
      state.selected >= 0 &&
      cameraRef.current &&
      shapeRef.current[state.selected]
    ) {
      cameraRef.current.moveTo(shapeRef.current[state.selected] as any, 200);
    }
  }, [state.selected, cameraRef, shapeRef]);

  // This field state is local, until unmout
  useEffect(() => {
    return () => {
      setFieldTouched('shape', true);
      setFieldValue('shape', shapeRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.mapWrapper}>
        <MapLayoutBase
          cameraRef={cameraRef}
          initialBounds={region?.bounds || WORLD_BOUNDS}
          mapView={<PiToMap ref={mapRef} {...state} {...handlers} />}
        >
          <PiToOverlay selected={state.selected} moving={moving} />
        </MapLayoutBase>
      </View>
      <View style={styles.controls}>
        <PiToControl index={0} state={state} select={select} />
        <PiToControl index={1} state={state} select={select} />
        <FAB
          style={styles.fab}
          icon="pencil"
          onPress={toggleDialog}
          accessibilityLabel="edit shape"
          testID="shape-fab"
        />
        {dialogOpen && (
          <PiToDialog
            initialShape={state.shape}
            setShape={set}
            onDismiss={toggleDialog}
          />
        )}
      </View>
    </View>
  );
});

PiToField.displayName = 'PiToField';

export default PiToField;
