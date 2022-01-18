import isNil from 'lodash/isNil';

import { formatDistanceToNow } from '../../i18n';
import { prettyNumber } from '.';
import { getBindingFormula } from './formulas';
import { getSectionColor } from './getSectionColor';
import { ListedSectionFragment } from './listSections.generated';
import { SectionDerivedFields } from './types';

export function addDerivedFields(
  section: ListedSectionFragment,
): ListedSectionFragment & SectionDerivedFields {
  let flowsThumb: SectionDerivedFields['flowsThumb'] | undefined;
  const { gauge } = section;
  if (gauge) {
    const { latestMeasurement: msmnt, flowUnit, levelUnit } = gauge;
    if (msmnt?.flow || msmnt?.level) {
      const levels = getBindingFormula(section.levels);
      const flows = getBindingFormula(section.flows);
      const color = getSectionColor(section);

      const unit = msmnt.flow ? flowUnit : levelUnit;
      const value = msmnt.flow ? flows(msmnt.flow) : levels(msmnt.level);
      if (!isNil(value)) {
        flowsThumb = {
          color,
          unit: unit ?? '',
          value: prettyNumber(value),
          fromNow: formatDistanceToNow(new Date(msmnt.timestamp), {
            addSuffix: true,
          }),
        };
      }
    }
  }
  return {
    ...section,
    flowsThumb,
  };
}
