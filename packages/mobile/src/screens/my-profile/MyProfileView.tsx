import { AuthContext } from '@whitewater-guide/clients';
import identity from 'lodash/identity';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Divider, Title } from 'react-native-paper';
import {
  Avatar,
  Paper,
  RadioDialog,
  RetryPlaceholder,
  Screen,
} from '../../components';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../../i18n';
import theme from '../../theme';
import { PurchasesListView } from './purchases';
import { SignOutButton } from './SignOutButton';
import { InnerProps } from './types';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    padding: theme.margin.single,
  },
  avatar: {
    marginRight: theme.margin.single,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.margin.single,
    marginBottom: theme.margin.single,
  },
});

const labelExtractor = (code: string) => LANGUAGE_NAMES[code];

class MyProfileView extends React.PureComponent<InnerProps> {
  constructor(props: InnerProps) {
    super(props);
  }

  onChangeLanguage = async (language: string) => {
    try {
      await this.props.updateMyProfile({ language });
    } catch (e) {
      // ignore
    }
  };

  render() {
    const { t, me } = this.props;
    if (!me) {
      return <RetryPlaceholder labelKey={'myProfile:notLoggedIn'} />;
    }
    const language = me.language || 'en';
    const avatar = me.avatar || '';
    const username = me.name || '';
    return (
      <Screen noScroll={true} noPadding={true}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
          <Paper gutterBottom={true} style={styles.userHeader}>
            <Avatar avatar={avatar} name={username} style={styles.avatar} />
            <Title>{username}</Title>
          </Paper>
          <Paper gutterBottom={true}>
            <Title>{t('myProfile:general')}</Title>
            <Divider style={{ marginBottom: theme.margin.single }} />
            <RadioDialog
              handleTitle={t('myProfile:language') as string}
              cancelLabel={t('commons:cancel') as string}
              value={language}
              options={SUPPORTED_LANGUAGES}
              onChange={this.onChangeLanguage}
              keyExtractor={identity}
              labelExtractor={labelExtractor}
            />
          </Paper>
          <PurchasesListView />
        </ScrollView>
        <SignOutButton />
      </Screen>
    );
  }
}

export default MyProfileView;
