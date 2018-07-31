import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { settings } from '../../core/actions';
import { WithT } from '../../i18n';
import theme from '../../theme';
import { Icon } from '../Icon';

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: theme.margin.single,
    left: theme.margin.single,
    backgroundColor: theme.colors.primaryBackground,
    borderRadius: theme.rounding.single,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.75,
    },
    shadowOpacity: 0.24,
    shadowRadius: 1.5,
  },
});

interface Props extends WithT {
  onLayerChange: (layer: string) => void;
}

class LayersIcon extends React.PureComponent<Props> {
  _actionSheet: ActionSheet | null = null;
  _actionSheetOptions: string[];

  constructor(props: Props) {
    super(props);
    this._actionSheetOptions = [
      props.t('region:map.layers.standard'),
      props.t('region:map.layers.terrain'),
      props.t('region:map.layers.satellite'),
      props.t('region:map.layers.hybrid'),
      props.t('commons:cancel'),
    ];
  }

  onShowActionSheet = () => {
    if (this._actionSheet) {
      this._actionSheet.show();
    }
  };

  onSelectLayer = (index: number) => {
    this.props.onLayerChange(
      [
        'standard',
        'terrain',
        'satellite',
        'hybrid',
      ][index],
    );
  };

  setActionSheet = (ref: ActionSheet | null) => { this._actionSheet = ref; };

  render() {
    return (
      <React.Fragment>
        <Icon icon="layers" style={styles.icon} onPress={this.onShowActionSheet} />
        <ActionSheet
          ref={this.setActionSheet}
          title={this.props.t('region:map.layers.prompt')}
          options={this._actionSheetOptions}
          cancelButtonIndex={4}
          onPress={this.onSelectLayer}
        />
      </React.Fragment>
    );
  }
}

export default compose<Props, {}>(
  translate(),
  connect(
undefined,
    { onLayerChange: settings.setMapType },
  ),
)(LayersIcon);
