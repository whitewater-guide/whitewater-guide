/* eslint-disable import/no-duplicates */
import type { TimeLabelProps } from '@whitewater-guide/clients';
import { useChart } from '@whitewater-guide/clients';
import isEqual from 'date-fns/isEqual';
import { format } from 'date-fns-tz';
import React from 'react';
import type { VictoryLabelProps } from 'victory-core';
import { VictoryLabel } from 'victory-native';

import getSectionTimezone from '~/features/descents/getSectionTimezone';

const HighlightedLabel: React.FC<VictoryLabelProps> = ({ ...props }) => {
  const { section } = useChart();
  const timeZone = getSectionTimezone(section);
  const text = format(props.datum as any, 'dd LLL, HH:mm zzz', { timeZone });
  return <VictoryLabel {...props} text={text} y={6} dx={0} dy={0} />;
};

export const DescentTimeLabel: React.FC<TimeLabelProps> = React.memo(
  ({ days: _days, highlightedDate, ...props }) => {
    if (highlightedDate && isEqual(highlightedDate, props.datum as any)) {
      return <HighlightedLabel {...props} />;
    }
    return <VictoryLabel {...props} angle={90} dx={15} dy={-6} />;
  },
);

DescentTimeLabel.displayName = 'DescentTimeLabel';
