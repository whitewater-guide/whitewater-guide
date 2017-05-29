import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { List, ListItem, Text, Body, Right, Icon } from 'native-base';
import { RefreshControl, View } from 'react-native';
import { connect } from 'react-redux';
import { compose, hoistStatics } from 'recompose';
import { withRegionsList, selectRegion } from '../../commons/features/regions';
import { Screen, BurgerButton, withErrorsView, spinnerWhileLoading } from '../../components';

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

  renderRow = region => (
    <ListItem button onPress={() => this.onRegionSelected(region)}>
      <Body>
        <Text>{region.name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text note style={{ minWidth: 60 }}>{`Rivers: ${region.riversCount}`}</Text>
          <Text note>{`Sections: ${region.sectionsCount}`}</Text>
        </View>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );

  render() {
    const { regionsListLoading, refetchRegionsList } = this.props;
    const refreshControl = <RefreshControl refreshing={regionsListLoading} onRefresh={refetchRegionsList} />;
    return (
      <Screen noScroll>
        <List
          dataArray={this.props.regions}
          refreshControl={refreshControl}
          renderRow={this.renderRow}
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

