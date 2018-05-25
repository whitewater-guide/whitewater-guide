declare module 'react-native-config' {
  interface IConfig {
    GOOGLE_API_KEY: string;
    BACKEND_PROTOCOL: string;
    BACKEND_HOST: string;
    FACEBOOK_APP_ID: string;
    ENV_NAME: string;
  }

  const Config: IConfig;

  export default Config;
}
