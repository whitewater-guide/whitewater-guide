import identity from 'lodash/identity';
import React from 'react';
import { Button, Divider, Subheading } from 'react-native-paper';
import { Paper, RadioDialog, Screen, Spacer, } from '../../components';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../../i18n';
import theme from '../../theme';
import { PurchasesListView } from './purchases';
import { InnerProps } from './types';

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
    return (
      <Screen noScroll>
        <Paper>
          <Subheading>{t('myProfile:general')}</Subheading>
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
        <Spacer />
        <Button primary raised onPress={this.props.logout}>
          {t('myProfile:logout')}
        </Button>
      </Screen>
    );
  }
}

export default MyProfileView;
