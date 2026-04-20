import { format } from 'date-fns-tz';
import { StyleSheet, Text } from 'react-native';

import { useChartGeometry } from '../../../components/chart/ChartGeometryContext';

interface Props {
  date: Date;
  timezone: string;
}

function DescentHighlightedLabel({ date, timezone }: Props) {
  const { tsToX, boundsTop } = useChartGeometry();
  const x = tsToX(date.getTime());
  return (
    <Text style={[styles.label, { top: boundsTop + 2, left: x - 60 }]}>
      {format(date, 'dd LLL, HH:mm zzz', { timeZone: timezone })}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    width: 120,
    textAlign: 'center',
    fontSize: 10,
    color: '#AAA',
  },
});

export default DescentHighlightedLabel;
