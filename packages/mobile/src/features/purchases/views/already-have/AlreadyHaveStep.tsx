import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, DialogActions, DialogContent, Subheading } from 'react-native-paper';
import { WithT } from '../../../../i18n';
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

interface Props extends WithT {
  region: PremiumRegion;
  onCancel?: () => void;
}

class AlreadyHaveStep extends React.PureComponent<Props> {

  render() {
    const { onCancel, region, t } = this.props;
    return (
      <React.Fragment>
        <DialogContent style={styles.dialogContent}>
          <Subheading style={styles.subheading}>
            {t('iap:alreadyHave.message', { region: region.name })}
          </Subheading>
        </DialogContent>
        <DialogActions>
          <Button primary raised onPress={onCancel}>
            {t('commons:ok')}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default translate()(AlreadyHaveStep);
