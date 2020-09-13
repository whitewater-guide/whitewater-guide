import _formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { __DATE_FNS_LOCALE__ } from './configDateFNS';

export const formatDistanceToNow = (
  date: Date | number,
  options?: {
    includeSeconds?: boolean;
    addSuffix?: boolean;
  },
) => _formatDistanceToNow(date, { ...options, locale: __DATE_FNS_LOCALE__ });
