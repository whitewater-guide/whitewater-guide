import { TimeAxisSettings } from './types';

export function getDefaultTimeAxisSettings(days: number): TimeAxisSettings {
  if (days > 7) {
    return {
      tickFormat: 'do MMM',
      tickCount: 31,
    };
  }
  if (days === 7) {
    return {
      tickFormat: 'EEE do',
      tickCount: 7,
    };
  }
  return {
    tickFormat: (date) => {
      if (date.getHours() === 0) {
        return 'EEE do';
      }
      return 'HH:mm';
    },
    tickCount: 6,
  };
}
