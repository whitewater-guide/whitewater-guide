import { useAuth } from '@whitewater-guide/clients';

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Divider, Title } from 'react-native-paper';
import { Paper, RetryPlaceholder, Screen } from '../../components';
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
});

const MyProfileView: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { me, refreshProfile } = useAuth();
  if (!me) {
    return <RetryPlaceholder labelKey={'myProfile:notLoggedIn'} />;
  }
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(() => {
    setRefreshing(true);
    refreshProfile().finally(() => setRefreshing(false));
  }, [refreshProfile, setRefreshing]);
  const username = me.name || '';
  return (
    <Screen noScroll={true} noPadding={true}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <Paper gutterBottom={true} style={styles.userHeader}>
          <Title>{username}</Title>
          <VerificationStatus />
        </Paper>
        <Paper gutterBottom={true}>
          <Title>{t('myProfile:general')}</Title>
          <Divider style={{ marginBottom: theme.margin.single }} />
          <MyLanguage me={me} />
        </Paper>
        <PurchasesListView />
      </ScrollView>
      <SignOutButton />
      <SafeAreaView style={styles.safeArea} />
    </Screen>
  );
});

export default MyProfileView;
