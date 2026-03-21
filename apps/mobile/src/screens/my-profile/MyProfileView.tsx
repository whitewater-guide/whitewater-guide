import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Caption, Divider, Title } from 'react-native-paper';

import Paper from '~/components/Paper';
import RetryPlaceholder from '~/components/RetryPlaceholder';

import theme from '../../theme';
import MyLanguage from './MyLanguage';
import { PurchasesListView } from './purchases';
import { SignOutButton } from './SignOutButton';
import VerificationStatus from './VerificationStatus';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    padding: theme.margin.single,
  },
  avatar: {
    marginRight: theme.margin.single,
  },
  userHeader: {
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
  },
  safeArea: {
    backgroundColor: theme.colors.primary,
  },
  name: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const MyProfileView = React.memo(() => {
  const { t } = useTranslation();
  const { me, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    refreshProfile().finally(() => setRefreshing(false));
  }, [refreshProfile, setRefreshing]);

  if (!me) {
    return <RetryPlaceholder labelKey="screens:myprofile.notLoggedIn" />;
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
        <Paper gutterBottom style={styles.userHeader}>
          <View style={styles.name}>
            <Title>{username}</Title>
            <VerificationStatus />
          </View>
          {me.email && <Caption>{me.email}</Caption>}
        </Paper>
        <Paper gutterBottom>
          <Title>{t('screens:myprofile.general')}</Title>
          <Divider style={{ marginBottom: theme.margin.single }} />
          <MyLanguage me={me} />
        </Paper>
        <PurchasesListView />
      </ScrollView>
      <SignOutButton />
    </>
  );
});

MyProfileView.displayName = 'MyProfileView';

export default MyProfileView;
