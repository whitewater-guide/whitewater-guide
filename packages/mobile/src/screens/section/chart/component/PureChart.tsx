import { ChartViewProps } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  View,
} from 'react-native';

import { NoChart, VictoryTheme } from '~/components/chart';
import Loading from '~/components/Loading';

import ChartComponent from './ChartComponent';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends Omit<ChartViewProps, 'width' | 'height'> {
  loading: boolean;
}

const PureChart: React.FC<Props> = React.memo((props) => {
  const { section, gauge, loading, data, filter, unit } = props;
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setLayout(event.nativeEvent.layout);
    },
    [setLayout],
  );
  if (loading) {
    return <Loading />;
  }
  if (!data || data.length === 0) {
    return <NoChart noData />;
  }
  return (
    <View style={styles.container} onLayout={onLayout}>
      {!!layout && layout.width !== 0 && layout.height !== 0 && (
        <ChartComponent
          unit={unit}
          gauge={gauge}
          filter={filter}
          data={data}
          section={section}
          width={layout.width}
          height={layout.height}
          padding={{ top: 20, bottom: 54, left: 48, right: 16 }}
          theme={VictoryTheme}
        />
      )}
    </View>
  );
});

PureChart.displayName = 'PureChart';

export default PureChart;