import { SeasonLocalizer } from '@whitewater-guide/clients';
import memoize from 'lodash/memoize';
import { UseTranslationResponse } from 'react-i18next';

export const getSeasonLocalizer = memoize(
  (t: UseTranslationResponse['t']): SeasonLocalizer => (
    key: string,
    halfMonth?: any,
  ): string => {
    if (key === 'all') {
      return t('commons:allYear');
    }
    const month = Math.floor(halfMonth / 2);
    return t(`commons:${key}Month`, { month });
  },
);
