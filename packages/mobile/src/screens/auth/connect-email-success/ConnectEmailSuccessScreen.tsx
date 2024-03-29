import { useAuth } from '@whitewater-guide/clients';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, Title } from 'react-native-paper';

import { AuthScreenBase } from '../AuthScreenBase';
import type { ConnectEmailSuccessNavProps } from './types';

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});

const ConnectEmailSuccessScreen: React.FC<ConnectEmailSuccessNavProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { me } = useAuth();
  return (
    <AuthScreenBase>
      <View style={styles.body}>
        <Title>
          {t('screens:connectEmailSuccess.title', { name: me?.name })}
        </Title>
        <Paragraph>
          {t('screens:connectEmailSuccess.description', { email: me?.email })}
        </Paragraph>
      </View>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        {t('screens:connectEmailSuccess.submit')}
      </Button>
    </AuthScreenBase>
  );
};

export default ConnectEmailSuccessScreen;
