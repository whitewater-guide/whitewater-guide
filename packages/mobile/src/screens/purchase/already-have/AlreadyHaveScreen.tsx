import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Subheading, Title } from 'react-native-paper';

import { Screen } from '~/components/Screen';
import Spacer from '~/components/Spacer';
import { PurchaseAlreadyHaveNavProps } from '~/screens/purchase/already-have/types';

import theme from '../../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.margin.single,
  },
  okButton: {
    minWidth: 100,
  },
});

const AlreadyHaveScreen: React.FC<PurchaseAlreadyHaveNavProps> = ({
  navigation,
  route,
}) => {
  const { region } = route.params;
  const { t } = useTranslation();
  const onCancel = useCallback(() => {
    navigation.getParent()?.goBack();
  }, [navigation]);
  return (
    <Screen safeBottom>
      <View style={styles.container}>
        <Title>
          {t('screens:purchase.buy.title', { region: region.name })}
        </Title>
        <Subheading>
          {t('screens:purchase.alreadyHave.message', { region: region.name })}
        </Subheading>
        <Spacer />
        <Button mode="contained" onPress={onCancel} style={styles.okButton}>
          {t('commons:ok')}
        </Button>
      </View>
    </Screen>
  );
};

export default AlreadyHaveScreen;
