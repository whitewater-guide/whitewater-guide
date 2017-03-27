import { StackNavigator } from 'react-navigation';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import PageThree from './PageThree';

export default StackNavigator(
  {
    PageOne: { screen: PageOne },
    PageTwo: { screen: PageTwo },
    PageThree: { screen: PageThree },
  },
  {
    initialRouteName: 'PageOne',
  },
);
