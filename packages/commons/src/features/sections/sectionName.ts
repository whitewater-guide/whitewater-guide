import { Section } from './types';

export const sectionName = (section?: Section | null): string => {
  if (!section) {
    return '';
  }
  const riverName = section.river ? section.river.name : '';
  return [riverName, section.name].filter((s) => !!s).join(' - ');
};
