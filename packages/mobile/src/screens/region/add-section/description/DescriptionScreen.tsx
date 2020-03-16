import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Screen } from '~/components/Screen';
import TextField from '~/forms/TextField';
import theme from '../../../../theme';

const styles = StyleSheet.create({
  container: {
    padding: theme.margin.single,
    flex: 1,
  },
  description: {
    height: theme.stackScreenHeight - 100,
  },
});

const DescriptionScreen: React.FC = () => {
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
          testID="description"
          textAlignVertical="top"
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

DescriptionScreen.displayName = 'DescriptionScreen';
export default DescriptionScreen;
