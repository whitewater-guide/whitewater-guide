import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Subheading } from 'react-native-paper';

import { Screen } from '~/components/Screen';
import Spacer from '~/components/Spacer';
import theme from '~/theme';

import { PurchaseVerifyNavProps } from './types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.margin.single,
  },
  subheading: {
    marginBottom: theme.margin.single,
  },
  cancelButton: {
    marginRight: theme.margin.half,
  },
  button: {
    marginTop: theme.margin.double,
  },
});

const VerifyScreen: React.FC<PurchaseVerifyNavProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { me, refreshProfile, service } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshProfile().finally(() => setRefreshing(false));
  }, [refreshProfile, setRefreshing]);

  const [sending, setSending] = useState(false);
  const onSend = useCallback(() => {
    if (!me) {
      return;
    }
    setSending(true);
    service.requestVerification({ id: me.id }).finally(() => setSending(false));
  }, [service, me, setSending]);

  const onContinue = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  return (
    <Screen safeBottom={true}>
      <View style={styles.container}>
        <Subheading>
          {t('screens:purchase.verify.greeting', { name: me?.name })}
        </Subheading>
        <Paragraph>{t('screens:purchase.verify.description')}</Paragraph>
        <Button
          mode="outlined"
          style={styles.button}
          icon="email"
          loading={sending}
          onPress={sending ? undefined : onSend}
        >
          {t('screens:purchase.verify.email')}
        </Button>
        <Button
          mode="outlined"
          style={styles.button}
          icon="refresh"
          loading={refreshing}
          onPress={refreshing ? undefined : onRefresh}
        >
          {t('screens:purchase.verify.refresh')}
        </Button>
        <Spacer />
        <Button
          mode="contained"
          onPress={onContinue}
          disabled={!me || !me.verified}
        >
          {t('commons:continue')}
        </Button>
      </View>
    </Screen>
  );
};

export default VerifyScreen;
