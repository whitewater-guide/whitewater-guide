import React from 'react';
import { StackNavigator } from 'react-navigation';
import AllSectionsScreen from './AllSectionsScreen';
import { FilterScreen } from '../filter';

const AllSectionsModalStack = StackNavigator(
  {
    AllSectionsMain: {
      screen: AllSectionsScreen,
    },
    AllSectionsFilter: {
      screen: FilterScreen,
    },
  },
  {
    initialRouteName: 'AllSectionsMain',
    mode: 'modal',
    headerMode: 'none',
  },
);

export default AllSectionsModalStack;
