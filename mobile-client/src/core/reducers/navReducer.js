import { NavigationActions } from 'react-navigation';
import { RootRouter } from '../routes';
import { SELECT_REGION } from '../../commons/features/regions';

const initialState = RootRouter.getStateForAction({});

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SELECT_REGION:
      return RootRouter.getStateForAction(
        NavigationActions.navigate({ routeName: 'RegionDetails', params: payload }),
        state,
      );
    default:
      return RootRouter.getStateForAction(action, state) || state;
  }
}
