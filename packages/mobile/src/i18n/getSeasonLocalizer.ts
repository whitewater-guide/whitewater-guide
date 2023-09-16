import type { SeasonLocalizer } from '@whitewater-guide/clients';
import type { TFunction } from 'i18next';
import isNil from 'lodash/isNil';
import memoize from 'lodash/memoize';

export const getSeasonLocalizer = memoize(
  (t: TFunction): SeasonLocalizer =>
    (key: string, halfMonth?: number): string => {
      if (key === 'all') {
        return t('commons:allYear');
      }
      const month = isNil(halfMonth) ? undefined : Math.floor(halfMonth / 2);
      return t(`commons:${key}Month`, { month });
    },
);
