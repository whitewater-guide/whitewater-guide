import { SectionsStatus } from '@whitewater-guide/clients';
import debounce from 'lodash/debounce';
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
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

interface Props {
  status: SectionsStatus;
  loaded: number;
  count: number;
}

interface State {
  status: SectionsStatus;
}

class SectionsProgress extends React.PureComponent<
  Props & WithTranslation,
  State
> {
  readonly state: State = { status: this.props.status };

  updateState = debounce(this.setState, 200);

  componentWillUnmount() {
    this.updateState.cancel();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status !== this.props.status) {
      this.updateState({ status: this.props.status });
    }
  }

  render() {
    const { loaded, count, t } = this.props;
    const { status } = this.state;
    const visible =
      status !== SectionsStatus.READY && this.props.loaded < this.props.count;
    const caption = t(
      status === SectionsStatus.LOADING
        ? 'region:sections.loading'
        : 'region:sections.loadingUpdates',
      { loaded, count },
    );
    return (
      <View style={[styles.body, visible ? styles.visible : styles.hidden]}>
        <Caption style={styles.text}>{caption}</Caption>
      </View>
    );
  }
}

export default withTranslation()(SectionsProgress);
