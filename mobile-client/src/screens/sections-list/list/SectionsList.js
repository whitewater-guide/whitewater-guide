import React, { PureComponent } from 'react';
import { List, ListItem, Text, Body, Right, Icon } from 'native-base';
import { SectionsPropType } from '../../../commons/features/sections';

class SectionsList extends PureComponent {
  static propTypes = {
    sections: SectionsPropType.isRequired,
  };

  renderRow = (section) => {
    const { name, river } = section;
    return (
      <ListItem button>
        <Body>
          <Text>{`${river.name} - ${name}`}</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  };

  render() {
    const { list } = this.props.sections;
    return (
      <List dataArray={list} renderRow={this.renderRow} />
    );
  }
}

export default SectionsList;
