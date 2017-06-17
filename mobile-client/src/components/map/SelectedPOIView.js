import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { get } from 'lodash';
import SelectedElementView from './SelectedElementView';
import { POINames } from '../../commons/features/points';
import { Text } from '../index';

const styles = StyleSheet.create({
  header: {
    padding: 8,
  },
  body: {
    padding: 8,
  },
});

class SelectedPOIView extends React.PureComponent {

  static propTypes = {
    selectedPOI: PropTypes.object,
  };

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
        panelHeight={160}
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
