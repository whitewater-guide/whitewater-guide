import { useCallback } from 'react';
import { AppSettings, useAppSettings } from './AppSettingsProvider';

export const useMapType = () => {
  const { settings, updateSettings } = useAppSettings();
  const mapType = settings.mapType;
  const setMapType = useCallback(
    (mt: AppSettings['mapType']) => updateSettings({ mapType: mt }),
    [updateSettings],
  );
  return { mapType, setMapType };
};
