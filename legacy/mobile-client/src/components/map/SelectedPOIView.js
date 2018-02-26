import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { get } from 'lodash';
import SelectedElementView from './SelectedElementView';
import { POINames } from '../../commons/features/points';
import { Text } from '../index';
import theme from '../../theme';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  body: {
    padding: 8,
  },
});

class SelectedPOIView extends React.Component {

  static propTypes = {
    selectedPOI: PropTypes.object,
    onSectionSelected: PropTypes.func,
    onPOISelected: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    const oldId = this.props.selectedPOI && this.props.selectedPOI._id;
    const newId = nextProps.selectedPOI && nextProps.selectedPOI._id;
    return oldId !== newId;
  }

  renderHeader = () => (
    <View style={styles.header}>
      <Text>{get(this.props.selectedPOI, 'name', '_')}</Text>
      <Text note>{POINames[get(this.props.selectedPOI, 'kind', 'other')]}</Text>
    </View>
  );

  render() {
    const buttons = [{ label: 'Navigate', coordinates: get(this.props.selectedPOI, 'coordinates', [0, 0]) }];
    return (
      <SelectedElementView
        header={this.renderHeader()}
        buttons={buttons}
        selected={!!this.props.selectedPOI}
        {...this.props}
      >
        <View style={styles.body}>
          <Text>{ get(this.props.selectedPOI, 'description', ' ') }</Text>
        </View>
      </SelectedElementView>
    );
  }
}

export default SelectedPOIView;
