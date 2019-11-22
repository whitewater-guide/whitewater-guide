import { ChartViewProps } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  View,
} from 'react-native';
import Loading from '../Loading';
import ChartView from './ChartView';
import { NoChart } from './NoChart';
import VictoryTheme from './theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends ChartViewProps {
  loading: boolean;
}

const PureChart: React.FC<Props> = React.memo((props) => {
  const { section, gauge, loading, data, days, unit } = props;
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
        <ChartView
          unit={unit}
          gauge={gauge}
          days={days}
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
