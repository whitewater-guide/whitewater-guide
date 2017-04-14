import React, { PureComponent } from 'react';
import { Container, Content } from 'native-base';
import { connect } from 'react-redux';
import { compose, hoistStatics } from 'recompose';
import SectionsList from './list/SectionsList';
import { withSectionsList, SectionsPropType } from '../../commons/features/sections';
import withErrorsView from '../../commons/utils/withErrorsView';
import { ErrorRefetchScreen } from '../../components';

class SectionsListScreen extends PureComponent {
  static propTypes = {
    sections: SectionsPropType.isRequired,
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

const container = compose(
  withSectionsList({ withGeo: true }),
  withErrorsView(ErrorRefetchScreen),
  connect(),
);
export default hoistStatics(container)(SectionsListScreen);

