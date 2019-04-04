import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Clipboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import { Markdown } from '../../../../components';
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

interface Props {
  region: PremiumRegion;
  state: PurchaseState;
  price?: string;
  error?: [string] | [string, { [key: string]: string | undefined }] | null;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelable?: boolean;
}

const BuyProductStep: React.FC<Props> = (props) => {
  const { error, onConfirm, onCancel, price, state, cancelable = true } = props;
  const [t] = useTranslation();
  const copyError = useCallback(() => {
    if (error) {
      const errorString: string = t.apply(null, error) as any;
      Clipboard.setString(errorString);
    }
  }, [error, t]);

  const confirmButtonLabel = t(`iap:buy.confirmButton.${state}`, { price });
  const loading =
    state === PurchaseState.PRODUCT_LOADING ||
    state === PurchaseState.PRODUCT_PURCHASING ||
    state === PurchaseState.REFRESHING_PREMIUM ||
    state === PurchaseState.PURCHASE_SAVING;
  const renderCancelButton =
    state === PurchaseState.PURCHASE_SAVING_FATAL ? false : cancelable;
  return (
    <React.Fragment>
      <Dialog.Content style={styles.dialogContent}>
        <Markdown>{t('iap:buy.descriptionMd')}</Markdown>
        <View style={styles.errorWrapper}>
          {error && (
            <TouchableOpacity onPress={copyError}>
              <Text style={styles.error}>
                <Text style={styles.copy}>
                  {String.fromCharCode(61839) + ' '}
                </Text>
                {t.apply(null, error)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        {renderCancelButton && (
          <Button mode="outlined" onPress={onCancel}>
            {t('commons:cancel')}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onConfirm}
          disabled={loading}
          loading={loading}
        >
          {confirmButtonLabel}
        </Button>
      </Dialog.Actions>
    </React.Fragment>
  );
};

export default BuyProductStep;
