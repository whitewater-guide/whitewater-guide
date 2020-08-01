import { TimeAxisSettings } from './types';

export function getDefaultTimeAxisSettings(days: number): TimeAxisSettings {
  if (days > 7) {
    return {
      tickFormat: 'do MMM',
      tickCount: 31,
    };
  }
  if (days > 1) {
    return {
      tickFormat: 'EEE do',
      tickCount: 7,
    };
  }
  return {
    tickFormat: 'HH:mm',
    tickCount: 6,
  };
}
