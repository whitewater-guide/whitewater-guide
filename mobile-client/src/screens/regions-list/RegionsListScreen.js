import React, { PureComponent, PropTypes } from 'react';
import { List, ListItem, Text, Body, Right, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose, hoistStatics } from 'recompose';
import { withRegionsList } from '../../commons/features/regions';
import withErrorsView from '../../commons/utils/withErrorsView';
import { Screen, ErrorRefetchScreen, spinnerWhileLoading } from '../../components';

class RegionsListScreen extends PureComponent {
  static propTypes = {
    regions: PropTypes.array,
    dispatch: PropTypes.func,
  };

  static navigationOptions = {
    title: 'Regions',
  };

  onRegionSelected = (region) => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'RegionDetails',
      params: { regionId: region._id },
    }));
  };

  renderRow = region => (
    <ListItem button onPress={() => this.onRegionSelected(region)}>
      <Body>
        <Text>{region.name}</Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );

  render() {
    return (
      <Screen noScroll>
        <List dataArray={this.props.regions} renderRow={this.renderRow} />
      </Screen>
    );
  }
}

const container = compose(
  withRegionsList,
  spinnerWhileLoading(props => props.regionsListLoading),
  withErrorsView(ErrorRefetchScreen),
  connect(),
);

export default hoistStatics(container)(RegionsListScreen);

