import auth from './auth';
import iap from './iap';

export default {
  auth,
  iap,
  commons: {
    putIn: 'Старт',
    takeOut: 'Финиш',
    km: 'км',
    m: 'м',
    cm: 'см',
    'm3/s': 'м³/с',
    length: 'Длина',
    drop: 'Перепад',
    unknown: 'Нет данных',
    season: 'Сезон',
    flow: 'Расход',
    flows: 'Уровни',
    level: 'Уровень',
    navigate: 'Поехали',
    min: 'мин',
    max: 'макс',
    opt: 'опт',
    difficulty: 'Сложность',
    rating: 'Рейтинг',
    duration: 'Время',
    kayakingTypes: 'Виды каякинга',
    hazards: 'Опасности',
    supplyTypes: 'Питание реки',
    miscTags: 'Прочее',
    gauge: 'Линейка',
    cancel: 'Отмена',
    yes: 'Да',
    no: 'Нет',
    offline: 'Похоже что вы не онлайн...',
    retry: 'Повторить',
    bug: 'Упс! Что-то сломалось',
    premium: 'Премиум',
  },
  drawer: {
    myProfile: 'Мои настройки',
    facebookLogin: 'Войти через Facebook',
    regions: 'Регионы',
    faq: 'FAQ',
    termsAndConditions: 'Правила пользования',
    privacyPolicy: 'Политика конфиденциальности',
  },
  myProfile: {
    title: 'Мой профиль',
    general: 'Основные настройки',
    language: 'Язык',
    logout: 'Выйти',
    purchases: {
      title: 'Мои покупки',
      region: 'Регион',
      group: 'Пакет регионов',
    },
  },
  regionsList: {
    title: 'Регионы',
    riversCount: 'Рек',
    sectionsCount: 'Секций',
    gaugesCount: 'Линеек',
  },
  region: {
    info: {
      title: 'О регионе',
      noData: 'Информация отсутствует',
    },
    map: {
      title: 'Карта',
      selectedSection: {
        swipeUpTip: 'Потяни вверх',
        details: 'Подробнее',
        flows: 'Уровни',
      },
    },
    sections: {
      title: 'Секции',
      loading: 'Загружаю секции',
    },
  },
  section: {
    chart: {
      title: 'Уровни',
      periodToggle: {
        title: 'Выберите период',
        day: 'День',
        week: 'Неделя',
        month: 'Месяц',
      },
      flowToggle: 'Выберите показатель',
      lastRecorded: {
        title: 'Последнее значение',
        flow: 'расхода',
        level: 'уровня',
      },
      lastUpdated: 'Последнее обновление',
      approximateWarning: 'Линейка дает очень приблизительное\nзначение для этой секции',
      gaugeMenu: {
        title: 'Информация о линейке',
        aboutSource: 'Об источнике данных',
        webPage: 'Открыть страницу лиейки',
      },
      outdatedWarning: 'Вероятно, данные устарели :(',
      noData: 'Нет данных за этот период',
      noGauge: 'Нет линейки для этой секции',
    },
    guide: {
      title: 'Описание',
      noData: 'Для этой секции описание пока не добавлено',
    },
    media: {
      title: 'Медиа',
      photo: 'Фото',
      video: 'Видео',
      blog: 'Блоги',
      noMedia: {
        photo: 'Для этой секции пока нет фото :(',
        video: 'Для этой секции пока нет видео :(',
        blog: 'Для этой секции пока нет блогов :(',
      },
    },
    map: {
      title: 'Карта',
    },
    info: {
      title: 'Инфо',
    },
  },
  filter: {
    title: 'Фильтры',
    reset: 'Сбросить',
    difficultyValue: 'Сложность: {{minDiff}}',
    difficultyRange: 'Сложность: от {{minDiff}} до {{maxDiff}}',
    durationValue: 'Время: {{minDuration}}',
    durationRange: 'Время: от {{minDuration}} до {{maxDuration}}',
    rating: 'Минимальный рейтинг',
    search: 'Искать',
  },
  durations: {
    10: 'Много раз в день',
    20: 'Пара раз в день',
    30: 'На весь день',
    40: 'Возможна ночевка',
    50: 'Экспедиция',
  },
  poiTypes: {
    'put-in': 'Старт',
    'put-in-alt': 'Фльтернативный старт',
    'put-in-road': 'Конец дороги на старт',
    'take-out': 'Финиш',
    'take-out-alt': 'Альтернативный финиш',
    'take-out-road': 'Конец дороги на финиш',
    waterfall: 'Водопад',
    rapid: 'Порог',
    portage: 'Обнос',
    playspot: 'Плейспот',
    hazard: 'Опасность',
    'river-campsite': 'Место для лагеря',
    'wild-camping': 'Дикий кемпинг',
    'paid-camping': 'Платный кемпинг',
    gauge: 'Линейка',
    'hike-waypoint': 'Ориентир пешей заброски',
    bridge: 'Мост',
    dam: 'Плотина',
    'power-plant': 'Сброс ГЭС',
    'kayak-shop': 'Каякерский магазин',
    other: 'Прочее',
  },
};
