import { useAuth } from '@whitewater-guide/clients';
import { User } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Paragraph, Subheading } from 'react-native-paper';
import theme from '../../../../theme';

const styles = StyleSheet.create({
  button: {
    marginTop: theme.margin.double,
  },
});

interface Props {
  me: Pick<User, 'id' | 'name' | 'avatar' | 'verified'>;
}

const AuthStepUnverified: React.FC<Props> = ({ me }) => {
  const { refreshProfile, service } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refreshProfile().finally(() => setRefreshing(false));
  }, [refreshProfile, setRefreshing]);
  const onSend = useCallback(() => {
    setSending(true);
    service.requestVerification({ id: me.id }).finally(() => setSending(false));
  }, [service, me, setSending]);
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Subheading>
        {t('features:purchases.auth.unverified.header', { name: me.name })}
      </Subheading>
      <Paragraph>
        {t('features:purchases.auth.unverified.description')}
      </Paragraph>
      <Button
        mode="outlined"
        style={styles.button}
        icon="email"
        loading={sending}
        onPress={sending ? undefined : onSend}
      >
        {t('features:purchases.auth.unverified.email')}
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        icon="refresh"
        loading={refreshing}
        onPress={refreshing ? undefined : onRefresh}
      >
        {t('features:purchases.auth.unverified.refresh')}
      </Button>
    </React.Fragment>
  );
};

export default AuthStepUnverified;
