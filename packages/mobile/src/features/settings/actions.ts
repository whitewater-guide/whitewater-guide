import { actionCreatorFactory } from 'typescript-fsa';
import { AppSettings } from './types';

const factory = actionCreatorFactory('SETTINGS');

export const updateSettings = factory<Partial<AppSettings>>('UPDATE');
