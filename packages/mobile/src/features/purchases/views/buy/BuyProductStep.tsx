import React from 'react';
import { translate } from 'react-i18next';
import { Clipboard, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, DialogActions, DialogContent } from 'react-native-paper';
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
    fontSize: 12,
  },
  copy: {
    fontFamily: Platform.select({
      android: 'MaterialCommunityIcons',
      ios: 'Material Design Icons',
    }),
    marginRight: theme.margin.single,
  },
});

interface Props extends WithT {
  region: PremiumRegion;
  state: PurchaseState;
  price?: string;
  error?: [string] | [string, { [key: string]: string | undefined}] | null;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelable?: boolean;
}

class BuyProductStep extends React.PureComponent<Props> {
  copyError = () => {
    const { error, t } = this.props;
    Clipboard.setString(t.apply(null, error));
  };

  render() {
    const { error, onConfirm, onCancel, price, state, cancelable = true, t } = this.props;
    const confirmButtonLabel = t(`iap:buy.confirmButton.${state}`, { price });
    const loading = state === PurchaseState.PRODUCT_LOADING ||
      state === PurchaseState.PRODUCT_PURCHASING ||
      state === PurchaseState.REFRESHING_PREMIUM ||
      state === PurchaseState.PURCHASE_SAVING;
    const renderCancelButton = state === PurchaseState.PURCHASE_SAVING_FATAL ? false : cancelable;
    return (
      <React.Fragment>
        <DialogContent style={styles.dialogContent}>
          <Markdown>
            {t('iap:buy.descriptionMd')}
          </Markdown>
            <View style={styles.errorWrapper}>
              {
                error &&
                (
                  <TouchableOpacity onPress={this.copyError}>
                    <Text style={styles.error}>
                      <Text style={styles.copy}>{String.fromCharCode(61839) + ' '}</Text>
                      {t.apply(null, error)}
                    </Text>
                  </TouchableOpacity>
                )
              }
            </View>
        </DialogContent>
        <DialogActions>
          {
            renderCancelButton &&
            (
              <Button raised onPress={onCancel}>{t('commons:cancel')}</Button>
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
