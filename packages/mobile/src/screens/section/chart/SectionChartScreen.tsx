import { useFocusEffect } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { LayoutAnimation, Pressable } from 'react-native';
import useToggle from 'react-use/lib/useToggle';

import { NoChart } from '~/components/chart';
import Icon from '~/components/Icon';
import theme from '~/theme';

import SectionTabsScreen from '../SectionTabsScreen';
import ChartLayout from './ChartLayout';
import { SectionChartNavProps } from './types';

const SectionChartScreen: React.FC<SectionChartNavProps> = ({ navigation }) => {
  const section = useSection();
  const gauge = section?.gauge;

  const [collapsed, toggleCollapsed] = useToggle(false);

  const handleCollapse = useCallback(() => {
    toggleCollapsed();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [toggleCollapsed]);

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () =>
          gauge ? (
            <Pressable onPress={handleCollapse}>
              <Icon
                icon={collapsed ? 'arrow-collapse-all' : 'arrow-expand-all'}
                color={theme.colors.lightBackground}
              />
            </Pressable>
          ) : null,
      });
    }, [navigation, collapsed, handleCollapse, gauge]),
  );

  return (
    <SectionTabsScreen>
      {gauge ? (
        <ChartLayout section={section} gauge={gauge} collapsed={collapsed} />
      ) : (
        <NoChart reason="noGauge" />
      )}
    </SectionTabsScreen>
  );
};

export default SectionChartScreen;
