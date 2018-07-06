import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, DialogActions, DialogContent, DialogTitle, Paragraph, Subheading } from 'react-native-paper';
import theme from '../../theme';
import { PremiumRegion } from './types';

const styles = StyleSheet.create({
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

interface Props {
  region: PremiumRegion;
  price?: string;
  priceLoading?: boolean;
  error?: boolean;
  onCancel?: () => void;
  onBuy?: () => void;
  onRefetchIAP?: () => void;
}

export class BuyProductStep extends React.PureComponent<Props> {
  render() {
    const { region, error, onBuy, onCancel, onRefetchIAP, price, priceLoading } = this.props;
    const buyButton = error ? 'Retry' : (priceLoading ? 'Buy' : `Buy for ${price}`);
    return (
      <React.Fragment>
        <DialogTitle>{region.name}</DialogTitle>
        <DialogContent>
          <Subheading style={styles.subheading}>Buy premium region</Subheading>
          <Paragraph>You will get access to following features:</Paragraph>
          <Paragraph>• Descriptions of 44 sections</Paragraph>
          <Paragraph>• Unlocks navigate to put-in/take-out buttons</Paragraph>
          <Paragraph>• Unlocks precise coordinates of put-ins, take-outs and POIs</Paragraph>
          <View style={styles.errorWrapper}>
            {
              error &&
              (
                <Paragraph style={styles.error}>
                  Could not get product details, please check your internet connection
                </Paragraph>
              )
            }
          </View>
        </DialogContent>
        <DialogActions>
          <Button raised onPress={onCancel}>Cancel</Button>
          <Button
            primary
            raised
            onPress={error ? onRefetchIAP : onBuy}
            disabled={priceLoading}
            loading={priceLoading}
          >
            {buyButton}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}
