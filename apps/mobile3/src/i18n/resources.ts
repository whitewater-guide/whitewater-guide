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
  km: string;
  unknown: string;
  navigate: string;
  season: string;
  flow: string;
  flows: string;
  level: string;
  gauge: string;
  unverified: string;
  seeDetails: string;
  comingSoon: string;
}

export interface ChartNestedTranslations {
  [key: string]: string;
}

export interface ChartTranslations {
  [key: string]: string | ChartNestedTranslations;
  noData: string;
  noGauge: string;
  lastUpdated: string;
  flowToggle: string;
  periodToggle: ChartNestedTranslations;
  lastRecorded: ChartNestedTranslations;
  gaugeMenu: ChartNestedTranslations;
}

export interface SectionTranslations {
  [key: string]: ChartTranslations;
  chart: ChartTranslations;
}

export interface RegionsListTranslations {
  [key: string]: string;
  sectionsCount: string;
  gaugesCount: string;
}

export interface LicensePlacementTranslations {
  [key: string]: string;
  region: string;
  section: string;
  media: string;
}

export interface ComponentsTranslations {
  [key: string]: LicensePlacementTranslations;
  license: LicensePlacementTranslations;
}

export interface NoMediaTranslations {
  [key: string]: string;
  photo: string;
  video: string;
  blog: string;
}

export interface SectionMediaTranslations {
  [key: string]: NoMediaTranslations;
  noMedia: NoMediaTranslations;
}

export interface ScreensSectionTranslations {
  [key: string]: SectionMediaTranslations;
  media: SectionMediaTranslations;
}

export interface ScreensTranslations {
  [key: string]: ScreensSectionTranslations;
  section: ScreensSectionTranslations;
}

export interface LanguageBundle {
  [key: string]:
    | CommonsTranslations
    | SectionTranslations
    | RegionsListTranslations
    | ComponentsTranslations
    | ScreensTranslations;
  commons: CommonsTranslations;
  section: SectionTranslations;
  regionsList: RegionsListTranslations;
  components: ComponentsTranslations;
  screens: ScreensTranslations;
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
      km: 'km',
      unknown: 'unknown',
      navigate: 'Navigate',
      season: 'Season',
      flow: 'Flow',
      flows: 'Flows',
      level: 'Level',
      gauge: 'Gauge',
      'm³/s': 'm³/s',
      unverified: 'unverified',
      seeDetails: 'See details',
      comingSoon: 'Coming soon',
    },
    regionsList: {
      sectionsCount: 'Sections',
      gaugesCount: 'Gauges',
    },
    components: {
      license: {
        media: '{{ name }}',
        region:
          'All the information in this region is available under {{ name }}, unless stated otherwise',
        section:
          'All the information about this section is available under {{ name }}, unless stated otherwise',
      },
    },
    screens: {
      section: {
        media: {
          noMedia: {
            blog: 'No blogs for this section yet :(',
            photo: 'No photos for this section yet :(',
            video: 'No videos for this section yet :(',
          },
        },
      },
    },
    section: {
      chart: {
        noData: 'There is no data for this period',
        noGauge: 'There is no gauge for this section',
        lastUpdated: 'Updated',
        flowToggle: 'Flow / Level',
        periodToggle: {
          title: 'Period',
          day: '1 day',
          '3days': '3 days',
          week: '1 week',
          month: '1 month',
        },
        lastRecorded: {
          title: 'Last recorded',
          flow: 'flow',
          level: 'level',
        },
        gaugeMenu: {
          title: 'Gauge',
          aboutSource: 'About data source',
          webPage: 'Gauge web page',
        },
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
      km: 'км',
      unknown: 'неизвестно',
      navigate: 'Навигация',
      season: 'Сезон',
      flow: 'Расход',
      flows: 'Уровни',
      level: 'Уровень',
      gauge: 'Линейка',
      'm³/s': 'м³/с',
      unverified: 'не проверено',
      seeDetails: 'Подробнее',
      comingSoon: 'Скоро',
    },
    regionsList: {
      sectionsCount: 'Секций',
      gaugesCount: 'Линеек',
    },
    components: {
      license: {
        media: '{{ name }}',
        region:
          'Вся информация в этом регионе опубликована под лицензией {{ name }}, если не указано иное',
        section:
          'Все информация об этой секции опубликована под лицензией {{ name }}, если не указано иное',
      },
    },
    screens: {
      section: {
        media: {
          noMedia: {
            blog: 'Для этой секции пока нет блогов :(',
            photo: 'Для этой секции пока нет фото :(',
            video: 'Для этой секции пока нет видео :(',
          },
        },
      },
    },
    section: {
      chart: {
        noData: 'Нет данных за этот период',
        noGauge: 'Нет линейки для этой секции',
        lastUpdated: 'Обновлено',
        flowToggle: 'Расход / Уровень',
        periodToggle: {
          title: 'Период',
          day: '1 день',
          '3days': '3 дня',
          week: '1 неделя',
          month: '1 месяц',
        },
        lastRecorded: {
          title: 'Последнее значение',
          flow: 'расход',
          level: 'уровень',
        },
        gaugeMenu: {
          title: 'Линейка',
          aboutSource: 'Об источнике',
          webPage: 'Страница линейки',
        },
      },
    },
  },
};
