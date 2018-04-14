import { NavigationAction, NavigationActions, NavigationState } from 'react-navigation';
import { RootRouter } from '../routes';

// Initial state is: MainStack with login StackOnTopOfIt
let initialState = RootRouter.getStateForAction({} as any, undefined);
initialState = RootRouter.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), initialState);

export default function(state: NavigationState = initialState, action: NavigationAction): NavigationState {
  const nextState = RootRouter.getStateForAction(action, state);
  return nextState || state;
}
