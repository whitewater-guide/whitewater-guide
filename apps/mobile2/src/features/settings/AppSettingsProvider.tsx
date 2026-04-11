import noop from 'lodash/noop';
import type { FC, PropsWithChildren } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { createMMKV } from 'react-native-mmkv';

import Layers from '../../components/map/layers';

const storage = createMMKV({ id: 'app-settings' });
const SETTINGS_KEY = '@ww-settings';

export interface AppSettings {
  mapType: string;
}

export interface AppSettingsCtx {
  settings: AppSettings;
  updateSettings: (v: Partial<AppSettings>) => void;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  mapType: Layers.TERRAIN.url,
};

const loadSettings = (): AppSettings => {
  const raw = storage.getString(SETTINGS_KEY);
  if (!raw) {
    return DEFAULT_APP_SETTINGS;
  }
  try {
    return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
};

export const AppSettingsContext = createContext<AppSettingsCtx>({
  settings: DEFAULT_APP_SETTINGS,
  updateSettings: noop,
});

export const AppSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const updateSettings = useCallback((v: Partial<AppSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...v };
      storage.set(SETTINGS_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const value = useMemo<AppSettingsCtx>(
    () => ({ settings, updateSettings }),
    [settings, updateSettings],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
