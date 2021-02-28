import AsyncStorage from '@react-native-community/async-storage';
import noop from 'lodash/noop';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import Layers from '~/components/map/layers';

export interface AppSettings {
  mapType?: string;
}

export interface AppSettingsCtx {
  settings: AppSettings;
  updateSettings: (v: Partial<AppSettings>) => void;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  mapType: Layers.TERRAIN.url,
};

export const AppSettingsContext = React.createContext<AppSettingsCtx>({
  settings: DEFAULT_APP_SETTINGS,
  updateSettings: noop,
});

const KEY = '@ww-settings';

const loadSettings = async (): Promise<AppSettings> => {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    return DEFAULT_APP_SETTINGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
};

const persistSettings = async (v: AppSettings) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(v));
};

export const AppSettingsProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, [setSettings]);

  const updateSettings = useCallback(
    (v: Partial<AppSettings>) => {
      const newSettings = { ...settings, ...v };
      setSettings(newSettings);
      persistSettings(newSettings).catch(() => {
        // ignore
      });
    },
    [settings, setSettings],
  );

  return (
    <AppSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
