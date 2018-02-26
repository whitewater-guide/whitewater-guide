import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { compose, hoistStatics } from 'recompose';
import { withRegionsList, selectRegion } from '../../commons/features/regions';
import { Screen, BurgerButton, withErrorsView, spinnerWhileLoading } from '../../components';
import { RegionListItem, REGION_ITEM_HEIGHT } from './RegionListItem';

const keyExtractor = region => region._id;

const getItemLayout = (data, index) => ({
  length: REGION_ITEM_HEIGHT,
  offset: index * REGION_ITEM_HEIGHT,
  index,
});

class RegionsListScreen extends PureComponent {
  static propTypes = {
    regions: PropTypes.array,
    regionsListLoading: PropTypes.bool.isRequired,
    refetchRegionsList: PropTypes.func.isRequired,
    selectRegion: PropTypes.func.isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    title: 'Regions',
    headerLeft: (<BurgerButton navigation={navigation} />),
  });

  onRegionSelected = (region) => {
    this.props.selectRegion(region._id);
  };

  renderItem = ({ item }) => (<RegionListItem region={item} onPress={this.onRegionSelected} />);

  render() {
    const { regionsListLoading, refetchRegionsList } = this.props;
    return (
      <Screen noScroll>
        <FlatList
          data={this.props.regions}
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          onRefresh={refetchRegionsList}
          refreshing={regionsListLoading}
        />
      </Screen>
    );
  }
}

const container = compose(
  withRegionsList,
  spinnerWhileLoading(props => props.regionsListLoading),
  withErrorsView,
  connect(undefined, { selectRegion }),
);

export default hoistStatics(container)(RegionsListScreen);

