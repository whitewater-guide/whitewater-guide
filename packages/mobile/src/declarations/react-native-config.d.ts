declare module 'react-native-config' {
  interface IConfig {
    GOOGLE_API_KEY: string;
    BACKEND: string;
  }

  declare const Config: IConfig;

  export default Config;
}
