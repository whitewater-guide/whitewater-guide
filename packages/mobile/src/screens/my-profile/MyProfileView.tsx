import { useAuth } from '@whitewater-guide/clients';
import Paper from 'components/Paper';
import RetryPlaceholder from 'components/RetryPlaceholder';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Divider, Title } from 'react-native-paper';
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
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(() => {
    setRefreshing(true);
    refreshProfile().finally(() => setRefreshing(false));
  }, [refreshProfile, setRefreshing]);
  if (!me) {
    return <RetryPlaceholder labelKey={'myProfile:notLoggedIn'} />;
  }
  const username = me.name || '';
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
});

export default MyProfileView;
