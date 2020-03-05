declare module 'react-native-config' {
  interface IConfig {
    BACKEND_PROTOCOL: string;
    BACKEND_HOST: string;
    FACEBOOK_APP_ID: string;
    ENV_NAME: string;
    SENTRY_DSN: string;
    MAPBOX_ACCESS_TOKEN: string;
    DISABLE_NAVIGATION_PERSISTENCE?: 'true';
    I18N_CI?: 'true';
  }

  const Config: IConfig;

  export default Config;
}
