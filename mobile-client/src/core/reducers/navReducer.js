import { RootRouter } from '../routes';

const initialState = RootRouter.getStateForAction({});

export default function (state = initialState, action) {
  return RootRouter.getStateForAction(action, state) || state;
}
