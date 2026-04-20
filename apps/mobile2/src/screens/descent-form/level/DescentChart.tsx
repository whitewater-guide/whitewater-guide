import { useNetInfo } from '@react-native-community/netinfo';
import { useChart } from '@whitewater-guide/clients';
import type { DescentLevelInput } from '@whitewater-guide/schema';
import { utcToZonedTime } from 'date-fns-tz';
import { useCallback, useState } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import NoChart from '../../../components/chart/NoChart';
import Loading from '../../../components/Loading';
import getSectionTimezone from '../../../features/descents/getSectionTimezone';
import DescentChartView from './DescentChartView';
import useOnDataLoaded from './useOnDataLoaded';

interface Props {
  startedAt: Date;
  onLoaded: (value?: DescentLevelInput) => void;
}

function DescentChart({ startedAt, onLoaded }: Props) {
  const {
    gauge,
    section,
    measurements: { loading, data, error },
    filter,
    unit,
  } = useChart();

  useOnDataLoaded({ data, unit, startedAt, gauge, onLoaded });

  const { isInternetReachable } = useNetInfo();
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (isInternetReachable === false && !!error) {
    return <NoChart reason="offline" />;
  }
  if (!data || data.length === 0) {
    return <NoChart reason="noData" />;
  }

  const timezone = getSectionTimezone(section);
  const highlightedDate = utcToZonedTime(startedAt, timezone);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {!!layout && layout.width > 0 && layout.height > 0 && (
        <DescentChartView
          data={data}
          unit={unit}
          gauge={gauge}
          section={section}
          filter={filter}
          width={layout.width}
          height={layout.height}
          highlightedDate={highlightedDate}
          timezone={timezone}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DescentChart;
