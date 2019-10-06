import Markdown from 'components/Markdown';
import Spacer from 'components/Spacer';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { PremiumRegion } from '../../../features/purchases';
import theme from '../../../theme';
import PurchaseErrorView from './PurchaseErrorView';
import { PurchaseState } from './types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.margin.single,
  },
});

const mdStyles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

interface Props {
  region: PremiumRegion;
  purchaseState: PurchaseState;
}

const BuyView: React.FC<Props> = React.memo((props) => {
  const { region, purchaseState } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Title>{t('screens:purchase.buy.title', { region: region.name })}</Title>
      <Markdown styles={mdStyles}>
        {t('screens:purchase.buy.descriptionMd')}
      </Markdown>
      <PurchaseErrorView error={purchaseState.error} />
      <Spacer />
      <Button
        mode="contained"
        loading={purchaseState.loading}
        onPress={purchaseState.onPress}
      >
        {purchaseState.button}
      </Button>
    </View>
  );
});

BuyView.displayName = 'BuyView';

export default BuyView;
