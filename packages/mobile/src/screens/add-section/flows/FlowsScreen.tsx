import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ScrollViewProps } from 'react-native';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { listenToKeyboardEvents } from 'react-native-keyboard-aware-scroll-view';
import { Title } from 'react-native-paper';

import { Screen } from '~/components/Screen';
import NumericField from '~/forms/NumericField';
import TextField from '~/forms/TextField';
import theme from '~/theme';

import GaugePlaceholder from './GaugePlaceholder';
import { SeasonNumericField } from './season';
import type { AddSectionFlowsNavProps } from './types';

// weird hack to make listenToKeyboardEvents work
ScrollView.displayName = 'ScrollView';
const KAVScroll: React.ComponentType<
  ScrollViewProps & React.RefAttributes<unknown>
> = listenToKeyboardEvents(ScrollView);
KAVScroll.displayName = 'KAVScroll';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

const FlowsScreen: React.FC<AddSectionFlowsNavProps> = React.memo(
  ({ navigation }) => {
    const { t } = useTranslation();
    return (
      <Screen>
        <KAVScroll contentContainerStyle={styles.content}>
          <Title>{t('commons:season')}</Title>
          <SeasonNumericField
            name="seasonNumeric"
            testID="season-numeric-picker"
          />
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

          <GaugePlaceholder navigation={navigation} />

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
          <TextField
            name="levels.formula"
            autoCapitalize="none"
            autoCorrect={false}
            label={t('screens:addSection.flows.flows.formulaLabel')}
            helperText={t('screens:addSection.flows.flows.formulaHelper')}
          />
        </KAVScroll>
      </Screen>
    );
  },
);

FlowsScreen.displayName = 'FlowsScreen';

export default FlowsScreen;
