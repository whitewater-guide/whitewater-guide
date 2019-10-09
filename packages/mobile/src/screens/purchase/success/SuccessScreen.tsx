import { Screen } from 'components/Screen';
import Spacer from 'components/Spacer';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Subheading, Title } from 'react-native-paper';
import { NavigationScreenComponent } from 'react-navigation';
import theme from '../../../theme';
import { NavParams } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.margin.single,
  },
  subheading: {
    marginBottom: theme.margin.single,
  },
});

const SuccessScreen: NavigationScreenComponent = ({
  navigation,
  screenProps,
}) => {
  const { region } = screenProps as NavParams;
  const { t } = useTranslation();
  const onComplete = useCallback(() => {
    const parent = navigation.dangerouslyGetParent();
    if (parent) {
      parent.goBack();
    }
  }, [navigation]);
  return (
    <Screen safe={true}>
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
