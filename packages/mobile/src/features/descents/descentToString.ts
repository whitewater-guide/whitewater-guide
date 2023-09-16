import format from 'date-fns/format';
import type { TFunction } from 'i18next';

import type { DescentDetailsFragment } from '~/screens/descent/descentDetails.generated';

import descentLevelToString from './descentLevelToString';

export default function descentToString(
  t: TFunction,
  descent: DescentDetailsFragment,
): string {
  // prettier-ignore
  return `${t('screens:descent.info.section')}: ${descent.section.river.name} - ${descent.section.name} (${descent.section.region.name})

${t('screens:descent.info.startedAt')}: ${format(new Date(descent.startedAt), 'dd LLLL yyyy HH:mm')}

${t('screens:descent.info.level')}: ${descentLevelToString()}

${t('screens:descent.info.commentHeader')}: ${descent.comment}
`;
}
