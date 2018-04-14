import VK, { VKLoginResult } from 'react-native-vkontakte-login';
import { NavigationActions } from 'react-navigation';
import { call, put } from 'redux-saga/effects';

export default function *vkSaga() {
  console.log('Saga received login via vk');
  const vkResponse: VKLoginResult = yield call(VK.login, ['email']);
  console.log(vkResponse.email, vkResponse.access_token);
  // Assumption: LoginScreen is on top of the stack
  if (vkResponse.access_token) {
    yield put(NavigationActions.back());
  }
}
