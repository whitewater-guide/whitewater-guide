declare module 'react-native-config' {
  interface IConfig {
    BACKEND_PROTOCOL: string;
    BACKEND_HOST: string;
    FACEBOOK_APP_ID: string;
    ENV_NAME: string;
    SENTRY_DSN: string;
    MAPBOX_ACCESS_TOKEN: string;
    E2E_MODE?: 'true';
  }

  const Config: IConfig;

  export default Config;
}
