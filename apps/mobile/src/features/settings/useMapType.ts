import { useCallback } from 'react';

import type { AppSettings } from './AppSettingsProvider';
import { useAppSettings } from './AppSettingsProvider';

export const useMapType = () => {
  const { settings, updateSettings } = useAppSettings();
  const { mapType } = settings;
  const setMapType = useCallback(
    (mt: AppSettings['mapType']) => updateSettings({ mapType: mt }),
    [updateSettings],
  );
  return { mapType, setMapType };
};
