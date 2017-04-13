import React, { PureComponent, PropTypes } from 'react';
import { Container, Content, List, ListItem, Text, Body, Right, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRegionsList } from '../../commons/features/regions';
import withErrorsView from '../../commons/utils/withErrorsView';
import { ErrorRefetchScreen, spinnerWhileLoading } from '../../components';

class RegionsListScreen extends PureComponent {
  static propTypes = {
    regions: PropTypes.array,
    dispatch: PropTypes.func,
    errors: PropTypes.object,
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
      <Container>
        <Content>
          <List dataArray={this.props.regions} renderRow={this.renderRow} />
        </Content>
      </Container>
    );
  }
}

export default compose(
  withRegionsList,
  spinnerWhileLoading(props => props.regionsListLoading),
  withErrorsView(ErrorRefetchScreen),
  connect(),
)(RegionsListScreen);

