import { MenuView, type NativeActionEvent } from '@expo/ui/community/menu';
import { Unit } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ChartFlowToggleUnit } from './chart-flow-toggle-unit';
import { ChartRow } from './chart-row';
import { useChart } from './chart-provider';
import { useFormulas } from './use-formulas';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export function ChartFlowToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { unit, onChangeUnit, unitChangeable, gauge, section } = useChart();
  const { latestMeasurement, flowUnit, levelUnit } = gauge;
  const formulas = useFormulas(section);

  const onPressAction = useCallback(
    ({ nativeEvent }: NativeActionEvent) => {
      if (nativeEvent.event === Unit.FLOW || nativeEvent.event === Unit.LEVEL) {
        onChangeUnit(nativeEvent.event);
      }
    },
    [onChangeUnit],
  );

  let value = '?';
  if (latestMeasurement) {
    const numeric =
      unit === Unit.FLOW
        ? formulas.flows(latestMeasurement.flow ?? null)
        : formulas.levels(latestMeasurement.level ?? null);
    value = numeric == null ? '' : numeric.toFixed(2);
  }
  const unitName = unit === Unit.FLOW ? flowUnit : levelUnit;

  return (
    <ChartRow>
      <View style={styles.left}>
        <ThemedText type="smallBold">
          {`${t('section:chart.lastRecorded.title')} `}
        </ThemedText>
        <ChartFlowToggleUnit unit={unit} />
      </View>
      <View style={styles.right}>
        <ThemedText type="small">{`${value} ${t(`commons:${unitName}`)}`}</ThemedText>
        {unitChangeable && (
          <MenuView
            title={t('section:chart.flowToggle')}
            actions={[
              { id: Unit.FLOW, title: t('commons:flow') },
              { id: Unit.LEVEL, title: t('commons:level') },
            ]}
            onPressAction={onPressAction}
          >
            <Icon icon="dots-vertical" color={theme.primary} />
          </MenuView>
        )}
      </View>
    </ChartRow>
  );
}

const styles = StyleSheet.create({
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
