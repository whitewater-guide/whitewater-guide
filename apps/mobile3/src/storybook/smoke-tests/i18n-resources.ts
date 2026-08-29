export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export interface CommonsTranslations {
  [key: string]: string;
  ok: string;
  cancel: string;
  done: string;
  difficulty: string;
  allYear: string;
  create: string;
  copy: string;
}

export interface LanguageBundle {
  [key: string]: CommonsTranslations;
  commons: CommonsTranslations;
}

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  ru: 'Русский',
};

export const resources: Record<SupportedLanguage, LanguageBundle> = {
  en: {
    commons: {
      ok: 'OK',
      cancel: 'Cancel',
      done: 'Done',
      difficulty: 'Difficulty',
      allYear: 'All year',
      create: 'Create',
      copy: 'Copy',
    },
  },
  ru: {
    commons: {
      ok: 'ОК',
      cancel: 'Отмена',
      done: 'Готово',
      difficulty: 'Сложность',
      allYear: 'Круглый год',
      create: 'Создать',
      copy: 'Копировать',
    },
  },
};
