import { Request } from 'express';
import { get } from 'lodash';
import { LastMeasurementLoader } from '../features/measurements/data-loader';

export interface ContextUser {
  id: string;
  role: number;
  [key: string]: any;
}

export interface Context {
  language: string;
  user?: ContextUser;
  lastMeasurementLoader: LastMeasurementLoader;
}

export const newContext = (req?: Request): Context => {
  const user: ContextUser | undefined = req && req.user;
  const language = get(user, 'editorSettings.language') ||
    get(user, 'language') ||
    get(req, 'language') ||
    'en';
  return {
    user,
    language,
    lastMeasurementLoader: new LastMeasurementLoader(),
  };
};
