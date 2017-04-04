import React, { PropTypes, PureComponent } from 'react';
import { List, ListItem, Text, Body, Right, Icon } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { SectionsPropType } from '../../../commons/features/sections';

class SectionsList extends PureComponent {
  static propTypes = {
    sections: SectionsPropType.isRequired,
    dispatch: PropTypes.func,
  };

  onSectionSelected = (section) => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: section._id },
    }));
  };

  renderRow = (section) => {
    const { name, river } = section;
    return (
      <ListItem button onPress={() => this.onSectionSelected(section)}>
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

export default connect()(SectionsList);

