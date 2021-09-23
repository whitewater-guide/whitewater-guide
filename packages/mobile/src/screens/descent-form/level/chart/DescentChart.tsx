import { useLayout } from '@react-native-community/hooks';
import { useNetInfo } from '@react-native-community/netinfo';
import { useChart } from '@whitewater-guide/clients';
import { DescentLevelInput } from '@whitewater-guide/schema';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NoChart, VictoryTheme } from '~/components/chart';
import Loading from '~/components/Loading';
import theme from '~/theme';

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
  onLoaded: (value?: DescentLevelInput) => void;
}

export const DescentChart: React.FC<Props> = ({ onLoaded, startedAt }) => {
  const {
    gauge,
    section,
    measurements: { loading, data, error },
    filter,
    unit,
  } = useChart();
  const { height, width, onLayout } = useLayout();
  const { isInternetReachable } = useNetInfo();

  useOnDataLoaded({ data, unit, startedAt, gauge, onLoaded });

  if (loading) {
    return <Loading />;
  }

  if (isInternetReachable === false && !!error) {
    return <NoChart reason="offline" />;
  }

  if (!data || data.length === 0) {
    return <NoChart reason="noData" />;
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {!!height && (
        <DescentChartComponent
          unit={unit}
          gauge={gauge}
          filter={filter}
          data={data}
          section={section}
          width={width}
          height={Math.min(height, theme.screenWidth - 40)}
          padding={{ top: 20, bottom: 54, left: 48, right: 16 }}
          theme={VictoryTheme}
          highlightedDate={startedAt}
        />
      )}
    </View>
  );
};

DescentChart.displayName = 'Chart';
