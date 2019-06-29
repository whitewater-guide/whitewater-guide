import React from 'react';
import { Query } from 'react-apollo';
import { NavigationInjectedProps } from 'react-navigation';
import Screens from '../screen-names';
import { SectionGuideMenu } from './guide';
import { Result, SECTION_DETAILS } from './sectionDetails.query';

const HeaderRight: React.FC<NavigationInjectedProps> = ({ navigation }) => {
  const route = navigation.state.routes[navigation.state.index].routeName;
  const sectionId = navigation.getParam('sectionId');
  switch (route) {
    case Screens.Section.Guide:
      return (
        <Query<Result>
          query={SECTION_DETAILS}
          fetchPolicy="cache-only"
          variables={{ sectionId }}
        >
          {({ data }) => (
            <SectionGuideMenu section={data ? data.section : null} />
          )}
        </Query>
      );
  }
  return null;
};

export default HeaderRight;
