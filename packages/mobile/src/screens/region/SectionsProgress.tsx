import debounce from 'lodash/debounce';
import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visible: {
    top: 0,
  },
  hidden: {
    top: -BAR_HEIGHT,
  },
  text: {
    color: theme.colors.textLight,
  },
});

interface Props extends WithT {
  isLoading: boolean;
  loaded: number;
  count: number;
}

interface State {
  isLoading: boolean;
}

class SectionsProgress extends React.PureComponent<Props, State> {
  readonly state: State = { isLoading: this.props.isLoading };

  updateState: any = debounce(this.setState, 200);

  componentWillReceiveProps(next: Props) {
    if (next.isLoading !== this.props.isLoading) {
      this.updateState({ isLoading: next.isLoading });
    }
  }

  render() {
    const { loaded, count, t } = this.props;
    const { isLoading } = this.state;
    const visible = isLoading && this.props.loaded < this.props.count;
    return (
      <View style={[styles.body, visible ? styles.visible : styles.hidden]}>
        <Caption style={styles.text}>{`${t('region:sections.loading')} ${loaded}/${count}`}</Caption>
      </View>
    );
  }
}

export default translate()(SectionsProgress);
