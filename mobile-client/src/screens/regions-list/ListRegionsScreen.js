import React, { PureComponent, PropTypes } from 'react';
import { Container, Content, List, ListItem, Text } from 'native-base';
import { withRegionsList } from '../../commons/features/regions';

class ListRegionsScreen extends PureComponent {
  static propTypes = {
    regions: PropTypes.array,
  };

  static navigationOptions = {
    title: 'List Regions',
  };

  renderRow = region => (
    <ListItem>
      <Text>{region.name}</Text>
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
