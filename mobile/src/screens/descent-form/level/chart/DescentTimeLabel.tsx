/* eslint-disable import/no-duplicates */
import { TimeLabelProps } from '@whitewater-guide/clients';
import format from 'date-fns/format';
import isEqual from 'date-fns/isEqual';
import React from 'react';
import { VictoryLabel } from 'victory-native';

export const DescentTimeLabel: React.FC<TimeLabelProps> = React.memo(
  ({ days: _days, highlightedDate, ...props }) => {
    if (highlightedDate && isEqual(highlightedDate, props.datum as any)) {
      const text = format(props.datum as any, 'dd LLL, HH:mm');
      return <VictoryLabel {...props} text={text} y={6} dx={0} dy={0} />;
    }
    return <VictoryLabel {...props} angle={90} dx={15} dy={-6} />;
  },
);

DescentTimeLabel.displayName = 'DescentTimeLabel';
