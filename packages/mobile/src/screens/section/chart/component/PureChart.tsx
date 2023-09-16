import type { ApolloError } from '@apollo/client';
import { useNetInfo } from '@react-native-community/netinfo';
import type { ChartViewProps } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { StyleSheet, View } from 'react-native';

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
  error?: ApolloError | null;
}

const PureChart: React.FC<Props> = React.memo((props) => {
  const { section, gauge, loading, data, filter, unit, error } = props;
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);
  const { isInternetReachable } = useNetInfo();

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setLayout(event.nativeEvent.layout);
    },
    [setLayout],
  );

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
          domainPadding={{ x: 0, y: [0, 30] }}
        />
      )}
    </View>
  );
});

PureChart.displayName = 'PureChart';

export default PureChart;
