import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';

import theme from '../../theme';
import { useAddSectionDraft } from './AddSectionDraftContext';

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

function SubmitButton() {
  const { submitApi } = useAddSectionDraft();
  const { t } = useTranslation();
  const [size, setSize] = useState({ width: 100, height: 32 });

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setSize({
      width: nativeEvent.layout.width,
      height: nativeEvent.layout.height,
    });
  };

  if (!submitApi) {
    return null;
  }

  if (submitApi.isSubmitting) {
    return (
      <View style={[size, styles.loading]}>
        <ActivityIndicator color={theme.colors.textLight} size="small" />
      </View>
    );
  }

  return (
    <Button
      textColor={theme.colors.textLight}
      style={!submitApi.isValid && styles.disabled}
      onPress={submitApi.submit}
      onLayout={onLayout}
      accessibilityLabel={t('commons:create')}
      testID="add-section-submit-btn"
    >
      {t('commons:create')}
    </Button>
  );
}

export default SubmitButton;
