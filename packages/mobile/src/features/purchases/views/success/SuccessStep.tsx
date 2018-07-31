import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Subheading } from 'react-native-paper';
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
  onComplete?: () => void;
}

class SuccessStep extends React.PureComponent<Props & WithI18n> {

  render() {
    const { t, region, onComplete } = this.props;
    return (
      <React.Fragment>
        <Dialog.Content style={styles.dialogContent}>
          <Subheading style={styles.subheading}>
            {t('iap:success.subheading')}
          </Subheading>
          <Paragraph>
            {t('iap:success.body', { region: region.name })}
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={onComplete}>
            {t('commons:ok')}
          </Button>
        </Dialog.Actions>
      </React.Fragment>
    );
  }
}

export default withI18n()(SuccessStep);
