import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Title } from 'react-native-paper';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../../components';
import { NumericField, TextField } from '../../../../components/forms';
import theme from '../../../../theme';
import TabBarLabel from '../TabBarLabel';
import GaugePlaceholder from './GaugePlaceholder';
import { SeasonNumericField } from './season';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

export const FlowsScreen: NavigationScreenComponent = React.memo(() => {
  const { t } = useTranslation();
  return (
    <Screen>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        <Title>{t('commons:season')}</Title>
        <SeasonNumericField name="seasonNumeric" />
        <TextField
          name="season"
          label={t('screens:addSection.flows.season')}
          helperText={t('screens:addSection.flows.seasonHelper')}
        />

        <TextField
          name="flowsText"
          label={t('screens:addSection.flows.flowsText')}
          helperText={t('screens:addSection.flows.flowsTextHelper')}
        />

        <GaugePlaceholder />

        <Title>{t('screens:addSection.flows.flows.title')}</Title>
        <NumericField
          name="flows.minimum"
          label={t('screens:addSection.flows.flows.min')}
        />
        <NumericField
          name="flows.optimum"
          label={t('screens:addSection.flows.flows.opt')}
        />
        <NumericField
          name="flows.maximum"
          label={t('screens:addSection.flows.flows.max')}
        />
        <NumericField
          name="flows.impossible"
          label={t('screens:addSection.flows.flows.imp')}
        />
        <TextField
          name="flows.formula"
          autoCapitalize="none"
          autoCorrect={false}
          label={t('screens:addSection.flows.flows.formulaLabel')}
          helperText={t('screens:addSection.flows.flows.formulaHelper')}
        />

        <Title>{t('screens:addSection.flows.levels.title')}</Title>
        <NumericField
          name="levels.minimum"
          label={t('screens:addSection.flows.levels.min')}
        />
        <NumericField
          name="levels.optimum"
          label={t('screens:addSection.flows.levels.opt')}
        />
        <NumericField
          name="levels.maximum"
          label={t('screens:addSection.flows.levels.max')}
        />
        <NumericField
          name="levels.impossible"
          label={t('screens:addSection.flows.levels.imp')}
        />
      </KeyboardAwareScrollView>
    </Screen>
  );
});

FlowsScreen.displayName = 'FlowsScreen';
FlowsScreen.navigationOptions = {
  tabBarLabel: (props: any) => (
    <TabBarLabel {...props} i18nKey="screens:addSection.tabs.flows" />
  ),
};
