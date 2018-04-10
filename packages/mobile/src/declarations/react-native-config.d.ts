declare module 'react-native-config' {
  interface IConfig {
    GOOGLE_API_KEY: string;
    BACKEND: string;
    FACEBOOK_APP_ID: string;
  }

  declare const Config: IConfig;

  export default Config;
}
