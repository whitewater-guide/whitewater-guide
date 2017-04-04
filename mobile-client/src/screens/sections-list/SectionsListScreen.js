import React, { PureComponent, PropTypes } from 'react';
import { Container, Content, List, ListItem, Text, Body, Right, Icon } from 'native-base';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import SectionsList from './list/SectionsList';
import { withSections, SectionsPropType } from '../../commons/features/sections';

class SectionsListScreen extends PureComponent {
  static propTypes = {
    sections: SectionsPropType.isRequired,
    dispatch: PropTypes.func,
  };

  static navigationOptions = {
    title: 'All Sections',
  };

  render() {
    return (
      <Container>
        <Content>
          <SectionsList sections={this.props.sections} />
        </Content>
      </Container>
    );
  }
}

export default compose(
  withSections({ withGeo: true }),
  connect(),
)(SectionsListScreen);

