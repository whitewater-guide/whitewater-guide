import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../../components';
import { TextField } from '../../../../components/forms';
import theme from '../../../../theme';
import TabBarLabel from '../TabBarLabel';

const styles = StyleSheet.create({
  container: {
    padding: theme.margin.single,
    flex: 1,
  },
  description: {
    flex: 1,
  },
});

export const DescriptionScreen: NavigationScreenComponent = () => {
  const { t } = useTranslation();
  return (
    <Screen>
      <KeyboardAvoidingView
        behavior="height"
        style={styles.container}
        keyboardVerticalOffset={64 + theme.safeBottom + theme.safeTop}
      >
        <TextField
          name="description"
          multiline={true}
          wrapperStyle={styles.description}
          style={styles.description}
          label={t('screens:addSection.description.label')}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

DescriptionScreen.displayName = 'DescriptionScreen';
DescriptionScreen.navigationOptions = {
  tabBarLabel: (props: any) => (
    <TabBarLabel {...props} i18nKey="screens:addSection.tabs.description" />
  ),
};
