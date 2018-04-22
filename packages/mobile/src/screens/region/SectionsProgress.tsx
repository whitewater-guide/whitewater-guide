import React from 'react';
import { translate } from 'react-i18next';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { WithT } from '../../i18n';
import theme from '../../theme';

const BAR_HEIGHT = 32;

const styles = StyleSheet.create({
  body: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visible: {
    top: 0,
  },
  hidden: {
    top: -BAR_HEIGHT,
  },
});

interface Props extends WithT {
  loaded: number;
  count: number;
}

class SectionsProgress extends React.PureComponent<Props> {

  componentWillReceiveProps(next: Props) {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    const { loaded, count, t } = this.props;
    const visible = this.props.loaded < this.props.count;
    return (
      <View style={[styles.body, visible ? styles.visible : styles.hidden]}>
        <Caption>{`${t('region:sections.loading')} ${loaded}/${count}`}</Caption>
      </View>
    );
  }
}

export default translate()(SectionsProgress);
