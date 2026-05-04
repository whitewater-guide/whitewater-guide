import { useFocusEffect } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import { useCallback, useState } from 'react';
import { LayoutAnimation, Pressable } from 'react-native';

import { ChartLayout, NoChart } from '../../../components/chart';
import Icon from '../../../components/Icon';
import theme from '../../../theme';
import SectionTabsScreen from '../SectionTabsScreen';
import type { SectionChartScreenProps } from './navigation-types';

function SectionChartScreen({ navigation }: SectionChartScreenProps) {
  const section = useSection();
  const [collapsed, setCollapsed] = useState(false);

  const gauge = section?.gauge;

  const toggleCollapsed = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsed((prev) => !prev);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!gauge) {
        navigation.getParent()?.setOptions({ headerRight: () => null });
        return;
      }
      navigation.getParent()?.setOptions({
        headerRight: () => (
          <Pressable onPress={toggleCollapsed} hitSlop={8}>
            <Icon
              icon={collapsed ? 'arrow-collapse-all' : 'arrow-expand-all'}
              color={theme.colors.textLight}
              narrow
            />
          </Pressable>
        ),
      });
    }, [navigation, gauge, collapsed, toggleCollapsed]),
  );

  return (
    <SectionTabsScreen>
      {gauge ? (
        <ChartLayout
          gauge={gauge}
          section={section ?? undefined}
          collapsed={collapsed}
        />
      ) : (
        <NoChart reason="noGauge" />
      )}
    </SectionTabsScreen>
  );
}

export default SectionChartScreen;
