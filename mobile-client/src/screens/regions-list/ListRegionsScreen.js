import React, { PureComponent, PropTypes } from 'react';
import { Container, Content, List, ListItem, Text, Body, Right, Icon } from 'native-base';
import { withRegionsList } from '../../commons/features/regions';

class ListRegionsScreen extends PureComponent {
  static propTypes = {
    regions: PropTypes.array,
  };

  static navigationOptions = {
    title: 'List Regions',
  };

  onRegionSelected = (region) => {
    console.log('Region selected', region);
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

export default withRegionsList(ListRegionsScreen);
