import resources from './resources';

export const SUPPORTED_LANGUAGES = Object.keys(resources);

export const LANGUAGE_NAMES: { [key: string]: string } = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  es: 'Español',
};
