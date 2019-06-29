import Mapbox from '@react-native-mapbox-gl/maps';
import React, { useContext, useState } from 'react';

type CameraSetter = (value: Mapbox.Camera | null) => void;

const CameraContext = React.createContext<Mapbox.Camera | null>(null);
const CameraSetterContext = React.createContext<CameraSetter>(() => {});

export const CameraProvider: React.FC = React.memo(({ children }) => {
  const [camera, setCamera] = useState<Mapbox.Camera | null>(null);
  return (
    <CameraSetterContext.Provider value={setCamera}>
      <CameraContext.Provider value={camera}>{children}</CameraContext.Provider>
    </CameraSetterContext.Provider>
  );
});

CameraProvider.displayName = 'CameraProvider';

export const useCameraSetter = () => useContext(CameraSetterContext);
export const useCamera = () => useContext(CameraContext);
