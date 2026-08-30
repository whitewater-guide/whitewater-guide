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
  copied: string;
  offline: string;
  bug: string;
  retry: string;
  putIn: string;
  takeOut: string;
  m: string;
  m3s: string;
}

export interface ChartTranslations {
  [key: string]: string;
  noData: string;
  noGauge: string;
}

export interface SectionTranslations {
  [key: string]: ChartTranslations;
  chart: ChartTranslations;
}

export interface LanguageBundle {
  [key: string]: CommonsTranslations | SectionTranslations;
  commons: CommonsTranslations;
  section: SectionTranslations;
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
      copied: 'Copied',
      offline: "It appears that you're offline...",
      bug: 'Oops! Something is broken',
      retry: 'Retry',
      putIn: 'Put-in',
      takeOut: 'Take-out',
      m: 'm',
      m3s: 'm³/s',
    },
    section: {
      chart: {
        noData: 'There is no data for this period',
        noGauge: 'There is no gauge for this section',
      },
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
      copied: 'Скопировано',
      offline: 'Похоже что вы не онлайн...',
      bug: 'Упс! Что-то сломалось',
      retry: 'Повторить',
      putIn: 'Старт',
      takeOut: 'Финиш',
      m: 'м',
      m3s: 'м³/с',
    },
    section: {
      chart: {
        noData: 'Нет данных за этот период',
        noGauge: 'Нет линейки для этой секции',
      },
    },
  },
};
