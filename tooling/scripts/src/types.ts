export enum EnvType {
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOCAL = 'local',
  DEVELOPMENT = 'development',
}
export const isEnvType = (value: any): value is EnvType =>
  Object.values(EnvType).includes(value);

export enum Machine {
  PRODUCTION = 'ww-production',
  STAGING = 'ww-staging',
  LOCAL = 'ww-local',
}
export const isMachine = (value: any): value is Machine =>
  Object.values(Machine).includes(value);
