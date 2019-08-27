import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import SectionMediaScreenContent from './SectionMediaScreenContent';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  fabHelper: {
    height: 64,
  },
});

export const SectionMediaScreen: NavigationScreenComponent = () => {
  const { node } = useSection();
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionMediaScreenContent section={node} />
        <View style={styles.fabHelper} />
      </ScrollView>
    </Screen>
  );
};

SectionMediaScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:media.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="image-multiple" color={theme.colors.textLight} />
  ),
};
