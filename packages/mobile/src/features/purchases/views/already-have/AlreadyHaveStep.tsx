import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Subheading } from 'react-native-paper';
import theme from '../../../../theme';
import { PremiumRegion } from '../../types';

const styles = StyleSheet.create({
  dialogContent: {
    flex: 1,
  },
  subheading: {
    marginBottom: theme.margin.single,
  },
});

interface Props {
  region: PremiumRegion;
  onCancel?: () => void;
}

class AlreadyHaveStep extends React.PureComponent<Props & WithI18n> {

  render() {
    const { onCancel, region, t } = this.props;
    return (
      <React.Fragment>
        <Dialog.Content style={styles.dialogContent}>
          <Subheading style={styles.subheading}>
            {t('iap:alreadyHave.message', { region: region.name })}
          </Subheading>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={onCancel}>
            {t('commons:ok')}
          </Button>
        </Dialog.Actions>
      </React.Fragment>
    );
  }
}

export default withI18n()(AlreadyHaveStep);
