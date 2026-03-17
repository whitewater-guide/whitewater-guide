import type { SeasonLocalizer } from '@whitewater-guide/clients';
import type { TFunction } from 'i18next';

export const getSeasonLocalizer = (() => {
  let cached: { t: TFunction; localizer: SeasonLocalizer } | null = null;

  return (t: TFunction): SeasonLocalizer => {
    if (cached && cached.t === t) {
      return cached.localizer;
    }
    const localizer: SeasonLocalizer = (
      key: string,
      halfMonth?: number,
    ): string => {
      if (key === 'all') {
        return t('commons:allYear');
      }
      const month =
        halfMonth === null || halfMonth === undefined
          ? undefined
          : Math.floor(halfMonth / 2);
      return t(`commons:${key}Month`, { month });
    };
    cached = { t, localizer };
    return localizer;
  };
})();
