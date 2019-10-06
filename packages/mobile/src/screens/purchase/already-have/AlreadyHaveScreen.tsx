import { Screen } from 'components/Screen';
import Spacer from 'components/Spacer';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Subheading, Title } from 'react-native-paper';
import { NavigationScreenComponent } from 'react-navigation';
import theme from '../../../theme';
import { NavParams } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.margin.single,
  },
  okButton: {
    minWidth: 100,
  },
});

const AlreadyHaveScreen: NavigationScreenComponent = ({
  navigation,
  screenProps,
}) => {
  const { region } = screenProps as NavParams;
  const { t } = useTranslation();
  const onCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <Screen safe={true}>
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
