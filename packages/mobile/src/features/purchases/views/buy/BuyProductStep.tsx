import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, DialogActions, DialogContent, Paragraph } from 'react-native-paper';
import { Markdown } from '../../../../components';
import { WithT } from '../../../../i18n';
import theme from '../../../../theme';
import { PremiumRegion, PurchaseState } from '../../types';

const styles = StyleSheet.create({
  dialogContent: {
    flex: 1,
  },
  subheading: {
    marginBottom: theme.margin.single,
  },
  errorWrapper: {
    marginTop: theme.margin.double,
    minHeight: theme.rowHeight,
    justifyContent: 'flex-end',
  },
  error: {
    color: theme.colors.error,
  },
});

interface Props extends WithT {
  region: PremiumRegion;
  state: PurchaseState;
  price?: string;
  error?: [string] | [string, { [key: string]: string }] | null;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelable?: boolean;
}

class BuyProductStep extends React.PureComponent<Props> {
  render() {
    const { error, onConfirm, onCancel, price, state, cancelable = true, t, region } = this.props;
    const confirmButtonLabel = t(`iap:buy.confirmButton.${state}`, { price });
    const loading = state === PurchaseState.PRODUCT_LOADING ||
      state === PurchaseState.PRODUCT_PURCHASING ||
      state === PurchaseState.REFRESHING_PREMIUM ||
      state === PurchaseState.PURCHASE_SAVING;
    const body = t('iap:buy.descriptionMd', { sectionsCount: region.sections!.count });
    return (
      <React.Fragment>
        <DialogContent style={styles.dialogContent}>
          <Markdown>
            {body}
          </Markdown>
          <View style={styles.errorWrapper}>
            {
              error &&
              (
                <Paragraph style={styles.error}>
                  {t.apply(null, error)}
                </Paragraph>
              )
            }
          </View>
        </DialogContent>
        <DialogActions>
          {
            cancelable &&
            (
              <Button raised onPress={onCancel}>Cancel</Button>
            )
          }
          <Button
            primary
            raised
            onPress={onConfirm}
            disabled={loading}
            loading={loading}
          >
            {confirmButtonLabel}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default translate()(BuyProductStep);
