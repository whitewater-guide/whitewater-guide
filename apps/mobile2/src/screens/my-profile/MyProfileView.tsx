import { useAuth } from '@whitewater-guide/clients';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Surface, Text } from 'react-native-paper';

import theme from '../../theme';
import MyLanguage from './MyLanguage';
import SignOutButton from './SignOutButton';
import VerificationStatus from './VerificationStatus';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    padding: theme.margin.single,
  },
  card: {
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
    borderRadius: theme.rounding.single,
  },
  name: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginBottom: theme.margin.single,
  },
});

function MyProfileView() {
  const { t } = useTranslation();
  const { me, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    refreshProfile().finally(() => setRefreshing(false));
  }, [refreshProfile]);

  if (!me) {
    return null;
  }

  const username = me.name || '';

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <Surface style={styles.card}>
          <View style={styles.name}>
            <Text variant="titleMedium">{username}</Text>
            <VerificationStatus />
          </View>
          {!!me.email && <Text variant="bodySmall">{me.email}</Text>}
        </Surface>
        <Surface style={styles.card}>
          <Text variant="titleMedium">{t('screens:myprofile.general')}</Text>
          <Divider style={styles.divider} />
          <MyLanguage me={me} />
        </Surface>
      </ScrollView>
      <SignOutButton />
    </>
  );
}

export default MyProfileView;
