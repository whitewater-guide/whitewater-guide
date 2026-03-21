import { useFormikContext } from 'formik';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';

import theme from '~/theme';

import type { SectionFormInput } from './types';

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

const SubmitButton = memo(() => {
  const { submitForm, isSubmitting, isValid, setTouched } =
    useFormikContext<SectionFormInput>();
  const { t } = useTranslation();
  const [size, setSize] = useState({ width: 100, height: 32 });

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setSize({
      width: nativeEvent.layout.width,
      height: nativeEvent.layout.height,
    });
  };

  const handlePress = () => {
    setTouched(
      {
        name: true,
        // @ts-ignore: this works fine
        river: true,
        difficulty: true,
        // @ts-ignore: this works fine
        shape: true,
      },
      true,
    );
    if (isValid) {
      submitForm().catch(() => {
        /* ignore */
      });
    }
  };

  if (isSubmitting) {
    return (
      <View style={[size, styles.loading]}>
        <ActivityIndicator color={theme.colors.textLight} size="small" />
      </View>
    );
  }

  return (
    <Button
      textColor={theme.colors.textLight}
      style={!isValid && styles.disabled}
      onPress={handlePress}
      onLayout={onLayout}
      accessibilityLabel={t('commons:create')}
      testID="add-section-submit-btn"
    >
      {t('commons:create')}
    </Button>
  );
});

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;
