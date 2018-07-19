import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Caption } from 'react-native-paper';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { purchaseActions } from '../../../../features/purchases';
import { WithT } from '../../../../i18n';
import { consumeRegion, WithRegion } from '../../../../ww-clients/features/regions';
import { Region, Section } from '../../../../ww-commons';

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface OuterProps {
  section: Section;
}

interface InnerProps extends OuterProps, WithRegion, WithT {
  buyRegion: (region: Region, sectionId: string) => void;
}

class PremiumPlaceholder extends React.PureComponent<InnerProps> {
  onBuy = () => {
    const { buyRegion, region: { node }, section } = this.props;
    buyRegion(node, section.id);
  };

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

const container = compose<InnerProps, OuterProps>(
  consumeRegion(),
  connect(
    undefined,
    { buyRegion: (region: Region, sectionId: string) => purchaseActions.openDialog({ region, sectionId }) },
  ),
  translate(),
);

export default container(PremiumPlaceholder);
