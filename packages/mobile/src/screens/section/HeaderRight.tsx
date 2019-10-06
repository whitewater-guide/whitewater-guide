import React from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import Screens from '../screen-names';
import { LazySectionGuideMenu } from './guide';

const HeaderRight: React.FC<NavigationInjectedProps> = ({ navigation }) => {
  const route = navigation.state.routes[navigation.state.index].routeName;
  const sectionId = navigation.getParam('sectionId');
  switch (route) {
    case Screens.Section.Guide:
      return <LazySectionGuideMenu sectionId={sectionId} />;
  }
  return null;
};

export default HeaderRight;
