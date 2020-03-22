import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Screen } from '~/components/Screen';
import TextField from '~/forms/TextField';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.margin.single,
    flex: 1,
  },
  descriptionWrapper: {
    flex: 1,
  },
});

const DescriptionScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Screen padding={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : undefined}
        style={styles.container}
        keyboardVerticalOffset={120}
      >
        <TextField
          name="description"
          multiline={true}
          wrapperStyle={styles.descriptionWrapper}
          fullHeight={true}
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
