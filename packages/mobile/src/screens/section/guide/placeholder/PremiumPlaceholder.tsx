import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { purchaseActions } from '../../../../features/purchases';
import { WithT } from '../../../../i18n';
import { consumeRegion, WithRegion } from '../../../../ww-clients/features/regions';
import { Region } from '../../../../ww-commons';

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends WithRegion, WithT {
  buyRegion: (region: Region) => void;
}

class PremiumPlaceholder extends React.PureComponent<Props> {
  onBuy = () => this.props.buyRegion(this.props.region.node);

  render() {
    const { t, region } = this.props;
    return (
      <View style={styles.container}>
        <Caption>{t('iap:section.message', { region: region.node.name })}</Caption>
        <Button raised primary onPress={this.onBuy}>
          {t('iap:section.button')}
        </Button>
      </View>
    );
  }
}

const container = compose(
  consumeRegion(),
  connect(
    undefined,
    { buyRegion: (region: Region) => purchaseActions.openDialog({ region }) },
  ),
  translate(),
);

export default container(PremiumPlaceholder);
