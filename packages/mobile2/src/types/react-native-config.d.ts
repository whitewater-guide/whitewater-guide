declare module 'react-native-config' {
  export interface NativeConfig {
    ENV_NAME: string;
    E2E_MODE: string;
    BACKEND_PROTOCOL: string;
    BACKEND_HOST: string;
    DEEP_LINKING_DOMAIN: string;
    STATIC_CONTENT_URL_BASE: string;
    CHAT_HOST: string;
    MAPBOX_ACCESS_TOKEN: string;
    SENTRY_DSN: string;
    STORYBOOK_ENABLED: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
