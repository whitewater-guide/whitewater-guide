import { useChart } from '@whitewater-guide/clients';
import { LevelInput } from '@whitewater-guide/logbook-schema';
import React, { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  View,
} from 'react-native';
import { NoChart, VictoryTheme } from '~/components/chart';
import Loading from '~/components/Loading';
import DescentChartComponent from './DescentChartComponent';
import useOnDataLoaded from './useOnDataLoaded';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  startedAt: Date;
  onLoaded: (value?: LevelInput) => void;
}

export const DescentChart: React.FC<Props> = ({ onLoaded, startedAt }) => {
  const {
    gauge,
    section,
    measurements: { loading, data },
    filter,
    unit,
  } = useChart();
  useOnDataLoaded({ data, unit, startedAt, gauge, onLoaded });
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setLayout(event.nativeEvent.layout);
    },
    [layout, setLayout],
  );
  if (loading) {
    return <Loading />;
  }
  if (!data || data.length === 0) {
    return <NoChart noData={true} />;
  }
  return (
    <View style={styles.container} onLayout={onLayout}>
      {!!layout && layout.width !== 0 && layout.height !== 0 && (
        <DescentChartComponent
          unit={unit}
          gauge={gauge}
          filter={filter}
          data={data}
          section={section}
          width={layout.width}
          height={layout.height}
          padding={{ top: 20, bottom: 54, left: 48, right: 16 }}
          theme={VictoryTheme}
          highlightedDate={startedAt}
        />
      )}
    </View>
  );
};

DescentChart.displayName = 'Chart';
