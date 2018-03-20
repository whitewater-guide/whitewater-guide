import { LastMeasurementLoader } from '../features/measurements';

export interface ContextUser {
  id: string;
  role: number;
  [key: string]: any;
}

export interface Context {
  user?: ContextUser;
  lastMeasurementLoader: LastMeasurementLoader;
}

export const newContext = (user?: ContextUser): Context => {
  return {
    user,
    lastMeasurementLoader: new LastMeasurementLoader(),
  };
};
