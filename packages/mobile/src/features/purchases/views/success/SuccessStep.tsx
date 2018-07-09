import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, DialogActions, DialogContent, DialogTitle, Paragraph, Subheading } from 'react-native-paper';
import { WithT } from '../../../../i18n';
import theme from '../../../../theme';
import { PremiumRegion } from '../../types';

const styles = StyleSheet.create({
  subheading: {
    marginBottom: theme.margin.single,
  },
});

interface Props extends WithT {
  region: PremiumRegion;
  onComplete?: () => void;
}

class SuccessStep extends React.PureComponent<Props> {

  render() {
    const { t, region, onComplete } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>{region.name}</DialogTitle>
        <DialogContent>
          <Subheading style={styles.subheading}>
            {t('iap:success.subheading')}
          </Subheading>
          <Paragraph>
            {t('iap:success.body', { region: region.name })}
          </Paragraph>
        </DialogContent>
        <DialogActions>
          <Button primary raised onPress={onComplete}>
            {t('commons:ok')}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default translate()(SuccessStep);
