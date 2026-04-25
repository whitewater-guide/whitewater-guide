import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type Mapbox from '@rnmapbox/maps';
import type { MapState } from '@rnmapbox/maps';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { FAB as FAButton } from 'react-native-paper';

import CameraControls from '../../../components/map/CameraControls';
import {
  CameraProvider,
  LocationPermission,
  useLocationPermission,
} from '../../../components/map/hooks';
import LayersSelector from '../../../components/map/LayersSelector';
import type { RootStackParamsList, Screens } from '../../../core/navigation';
import { useMapType } from '../../../features/settings';
import theme from '../../../theme';
import { useAddSectionDraft } from '../AddSectionDraftContext';
import { PiToDialog } from './dialog';
import DoneButton from './DoneButton';
import PiToControl from './PiToControl';
import PiToMap from './PiToMap';
import PiToOverlay from './PiToOverlay';
import { usePiToState } from './usePiToState';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
  },
  controls: {
    height: 64,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  fab: {
    position: 'absolute',
    bottom: 64 - 28,
    left: screenWidth / 2 - 28,
  },
});

const WORLD_BOUNDS: CodegenCoordinates[] = [
  [-179, -89, 0],
  [-179, 89, 0],
  [179, 89, 0],
  [179, -89, 0],
];

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.ADD_SECTION_SHAPE
>;

function ShapeScreen({ navigation }: Props) {
  const { draft, setDraft } = useAddSectionDraft();
  const { mapType } = useMapType();
  const locationPermission = useLocationPermission();
  const locationPermissionGranted =
    locationPermission === LocationPermission.GRANTED;

  const cameraRef = useRef<Mapbox.Camera | null>(null);
  const initialShape = useMemo(
    () => (draft.shape ?? []) as CodegenCoordinates[],
    // Seed once on mount; local reducer owns state while screen is active
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const { state, mapRef, move, select, set } = usePiToState(initialShape);
  const shapeRef = useRef(state.shape);
  shapeRef.current = state.shape;

  const [moving, setMoving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <DoneButton />,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    return () => {
      setDraft((prev) => ({
        ...prev,
        shape: shapeRef.current as unknown as CodegenCoordinates[],
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (state.selected === -1 || !cameraRef.current) {
      return;
    }
    const selected: 0 | 1 = state.selected;
    const point = shapeRef.current[selected];
    if (point) {
      cameraRef.current.moveTo(point as unknown as GeoJSON.Position, 200);
    }
  }, [state.selected]);

  const handlers = useMemo(
    () => ({
      onRegionIsChanging: () => setMoving(true),
      onMapIdle: (state: MapState) => {
        move(state.properties.center as CodegenCoordinates);
        setMoving(false);
      },
      onPress: () => select(-1),
    }),
    [move, select],
  );

  const toggleDialog = () => setDialogOpen((v) => !v);

  return (
    <View style={styles.root}>
      <View style={styles.mapWrapper}>
        <CameraProvider cameraRef={cameraRef}>
          <PiToMap
            ref={mapRef}
            {...state}
            mapType={mapType}
            locationPermissionGranted={locationPermissionGranted}
            initialBounds={WORLD_BOUNDS}
            {...handlers}
          />
          <PiToOverlay selected={state.selected} moving={moving} />
          <LayersSelector />
          <CameraControls
            locationPermissionGranted={locationPermissionGranted}
            initialBounds={WORLD_BOUNDS}
          />
        </CameraProvider>
      </View>
      <View style={styles.controls}>
        <PiToControl index={0} state={state} select={select} />
        <PiToControl index={1} state={state} select={select} />
        <FAButton
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
}

export default ShapeScreen;
