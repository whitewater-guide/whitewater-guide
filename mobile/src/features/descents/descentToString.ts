import { Descent } from '@whitewater-guide/commons';
import format from 'date-fns/format';
import { TFunction } from 'i18next';

import descentLevelToString from './descentLevelToString';

export default function descentToString(
  t: TFunction,
  descent: Descent,
): string {
  // prettier-ignore
  return `${t('screens:descent.info.section')}: ${descent.section.river.name} - ${descent.section.name} (${descent.section.region.name})

${t('screens:descent.info.startedAt')}: ${format(new Date(descent.startedAt), 'dd LLLL yyyy HH:mm')}

${t('screens:descent.info.level')}: ${descentLevelToString()}

${t('screens:descent.info.commentHeader')}: ${descent.comment}
`;
}
