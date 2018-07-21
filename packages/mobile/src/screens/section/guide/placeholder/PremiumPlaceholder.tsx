import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { compose } from 'recompose';
import { WithPremiumDialog } from '../../../../features/purchases';
import { WithT } from '../../../../i18n';
import { consumeRegion, WithRegion } from '../../../../ww-clients/features/regions';
import { Section } from '../../../../ww-commons';

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface OuterProps extends WithPremiumDialog {
  section: Section;
}

type InnerProps = OuterProps & WithRegion & WithT;

class PremiumPlaceholder extends React.PureComponent<InnerProps> {
  onBuy = () => {
    const { buyRegion, region: { node }, section } = this.props;
    buyRegion(node, section.id);
  };

  render() {
    const { t, region } = this.props;
    const node = region.node;
    const name = node ? node.name : '';
    return (
      <View style={styles.container}>
        <Caption>{t('iap:section.message', { region: name })}</Caption>
        <Button raised primary onPress={this.onBuy}>
          {t('iap:section.button')}
        </Button>
      </View>
    );
  }
}

const container = compose<InnerProps, OuterProps>(
  consumeRegion(),
  translate(),
);

export default container(PremiumPlaceholder);
