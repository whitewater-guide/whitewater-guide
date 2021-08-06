import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Subheading, Title } from 'react-native-paper';

import { Screen } from '~/components/Screen';
import Spacer from '~/components/Spacer';
import theme from '~/theme';

import { PurchaseSuccessNavProps } from './types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.margin.single,
  },
  subheading: {
    marginBottom: theme.margin.single,
  },
});

const SuccessScreen: React.FC<PurchaseSuccessNavProps> = ({
  navigation,
  route,
}) => {
  const { region } = route.params;
  const { t } = useTranslation();
  const onComplete = useCallback(() => {
    navigation.dangerouslyGetParent()?.goBack();
  }, [navigation]);
  return (
    <Screen safeBottom>
      <View style={styles.container}>
        <Title>
          {t('screens:purchase.buy.title', { region: region.name })}
        </Title>
        <Subheading style={styles.subheading}>
          {t('screens:purchase.success.subheading')}
        </Subheading>
        <Paragraph>
          {t('screens:purchase.success.body', { region: region.name })}
        </Paragraph>
        <Spacer />
        <Button mode="contained" onPress={onComplete}>
          {t('commons:ok')}
        </Button>
      </View>
    </Screen>
  );
};

export default SuccessScreen;
