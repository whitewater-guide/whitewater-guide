import identity from 'lodash/identity';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Divider, Title } from 'react-native-paper';
import { Avatar, Paper, RadioDialog, Screen } from '../../components';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../../i18n';
import theme from '../../theme';
import { PurchasesListView } from './purchases';
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
    const language = me && me.language || 'en';
    const avatar = me ? me.avatar : '';
    const username = me ? me.name : '';
    return (
      <Screen noScroll noPadding>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>
          <Paper gutterBottom style={styles.userHeader}>
            <Avatar avatar={avatar} name={username} style={styles.avatar} />
            <Title>{username}</Title>
          </Paper>
          <Paper gutterBottom>
            <Title>{t('myProfile:general')}</Title>
            <Divider style={{ marginBottom: theme.margin.single }}/>
            <RadioDialog
              handleTitle={t('myProfile:language')}
              cancelLabel={t('commons:cancel')}
              value={language}
              options={SUPPORTED_LANGUAGES}
              onChange={this.onChangeLanguage}
              keyExtractor={identity}
              labelExtractor={labelExtractor}
            />
          </Paper>
          <PurchasesListView />
        </ScrollView>
        <Button primary raised onPress={this.props.logout}>
          {t('myProfile:logout')}
        </Button>
      </Screen>
    );
  }
}

export default MyProfileView;
