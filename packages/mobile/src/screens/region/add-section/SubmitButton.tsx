import { useFormikContext } from 'formik';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import theme from '../../../theme';

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SubmitButton: React.FC = () => {
  const { submitForm, isSubmitting, isValid } = useFormikContext<any>();
  const { t } = useTranslation();
  const [size, setSize] = useState({ width: 100, height: 32 });
  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      setSize({
        width: nativeEvent.layout.width,
        height: nativeEvent.layout.height,
      });
    },
    [setSize],
  );
  if (isSubmitting) {
    return (
      <View style={[size, styles.loading]}>
        <ActivityIndicator color={theme.colors.textLight} size="small" />
      </View>
    );
  }
  return (
    <Button
      color={theme.colors.textLight}
      onPress={submitForm}
      onLayout={onLayout}
      disabled={!isValid}
      accessibilityLabel={t('commons:create')}
    >
      {t('commons:create')}
    </Button>
  );
};

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;
